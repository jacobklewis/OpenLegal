"use strict";
module.exports = function (app) {
  var docController = require("../controllers/docController");

  // Documents
  app.route("/projects/:projectId/documents").get(docController.getAllDocs);
  app
    .route("/projects/:projectId/documents/preview")
    .get(docController.getAllDocsPreview);
  app
    .route("/projects/:projectId/locales")
    .get(docController.getProjectLocales);
  app
    .route("/projects/:projectId/documents/:docId/:regionCode/:languageCode")
    .get(docController.getDoc)
    .put(docController.updateDoc);
  app
    .route(
      "/projects/:projectId/documents/:docId/:regionCode/:languageCode/history"
    )
    .get(docController.getDocHistory);
  app
    .route(
      "/projects/:projectId/documents/:docId/:regionCode/:languageCode/history/:historyId"
    )
    .get(docController.getDocByHistoryId);
  app
    .route("/projects/:projectId/documents/:docId/locales")
    .get(docController.getDocLocales);
};
