var express = require("express"),
  cors = require("cors"),
  app = express(),
  port = process.env.PORT || 3000,
  mongoose = require("mongoose"),
  DocModel = require("./api/models/Doc"),
  ProjectModel = require("./api/models/Project"),
  bodyParser = require("body-parser"),
  auth = require("./api/auth");

require("dotenv").config();
// mongoose instance connection url connection
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGO_CONNECTION);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "1mb" }));
app.use(
  cors({
    optionsSuccessStatus: 200,
  })
);
app.use(auth.isAuthorized);

const allRoutes = [
  "./api/routes/docRoutes",
  "./api/routes/localeRoutes",
  "./api/routes/projectRoutes",
];

allRoutes.forEach((routeURL) => {
  var nRoute = require(routeURL); //importing route
  nRoute(app); //register the route
});

app.listen(port);

console.log("RESTful API server started on: " + port);
