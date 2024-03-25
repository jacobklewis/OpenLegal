import mongoose from "mongoose";
let Project = mongoose.model("Project");

const ignoredPaths = [
  { path: "/status", methods: ["all"] },
  { path: "/locales", methods: ["all"] },
];
const isAuthorized = async function (req, res, next) {
  let ignore = false;
  ignoredPaths.forEach((path) => {
    let regEx = new RegExp(path.path);
    if (
      regEx.test(req.url) &&
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
    const project = await Project.findOne({
      token: token,
    }).exec();
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
    return next();
  }
};

export { isAuthorized };
