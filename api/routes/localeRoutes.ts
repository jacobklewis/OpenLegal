"use strict";
module.exports = function (app) {
  var localeController = require("../controllers/localeController");

  // Locales
  app.route("/locales").get(localeController.getLocales);
};
