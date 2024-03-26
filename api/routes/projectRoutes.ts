"use strict";
module.exports = function (app) {
  var projectController = require("../controllers/projectController");

  // Projects
  app
    .route("/projects/:projectId")
    .get(projectController.getProject)
    .put(projectController.updateProject)
    .delete(projectController.deleteProject);
  // ~ Admin only
  app
    .route("/projects")
    .post(projectController.addProject)
    .get(projectController.getProjects);
};
