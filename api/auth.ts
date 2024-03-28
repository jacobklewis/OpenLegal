import mongoose from "mongoose";
let Project = mongoose.model("Project");

const ignoredPaths = [
  { path: "/status", methods: ["all"], exact: true },
  { path: "/locales", methods: ["all"], exact: true },
];
const isAuthorized = async function (req, res, next) {
  let ignore = false;
  ignoredPaths.forEach((path) => {
    let regEx = new RegExp(path.path);
    if (
      (path.exact ? path.path == req.path : regEx.test(req.url)) &&
      (path.methods[0] == "all" || path.methods.includes(req.method))
    ) {
      ignore = true;
      return;
    }
  });
  if (ignore) {
    return next();
  }

  const token = req.get("x-api-key");
  try {
    let project = await Project.findOne({
      token: token,
    }).exec();
    if (!project) {
      project = await Project.findOne({
        readToken: token,
      }).exec();
    } else {
      req.writeAccess = true;
    }

    if (!project) {
      // Find project if project token is not provided
      const pathParts = req.path.split("/");
      if (pathParts.length >= 2) {
        project = await Project.findOne({
          id: pathParts[2],
        }).exec();
      }
    }
    if (project) {
      req.project = project;
    }
    if (project && req.path.indexOf("/" + project.id) != -1) {
      return next();
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error verifying token",
    });
    return;
  }
  // Admin Token
  if (token != process.env.ADMIN_TOKEN) {
    res.status(401).send({
      status: "x-api-key missing or incorrect",
    });
    return;
  } else {
    req.writeAccess = true;
    return next();
  }
};

export { isAuthorized };
