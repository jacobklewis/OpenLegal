"use strict";
module.exports = function (app) {
  var docController = require("../controllers/docController");

  // Documents
  app.route("/projects/:projectId/documents").get(docController.getAllDocs);
  app
    .route("/projects/:projectId/locales")
    .get(docController.getProjectLocales);
  app
    .route("/projects/:projectId/documents/:docId/:regionCode/:languageCode")
    .get(docController.getDoc)
    .put(docController.updateDoc);
  app
    .route("/projects/:projectId/documents/:docId/locales")
    .get(docController.getDocLocales);
};
