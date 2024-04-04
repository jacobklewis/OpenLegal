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
    console.log("ignore");
    return next();
  }

  const token = req.get("x-api-key");
  console.log("token", token);
  try {
    let project = await Project.findOne({
      token: token,
    }).exec();
    if (!project && token) {
      project = await Project.findOne({
        readToken: token,
      }).exec();
    } else if (token) {
      req.writeAccess = true;
    }
    if (project) {
      req.project = project;
    }
    if (project && req.path.indexOf("/" + project.id) != -1) {
      return next();
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
  } catch (err) {
    console.log(err);
    res.status(500).send({
      status: "error verifying token",
    });
    return;
  }
  console.log("token", token);
  // Admin Token
  if (token != process.env.ADMIN_TOKEN) {
    res.status(401).send({
      status: "x-api-key missing or incorrect",
    });
    return;
  } else {
    req.writeAccess = true;
    console.log("next admin");
    return next();
  }
};

export { isAuthorized };
