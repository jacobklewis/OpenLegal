var express = require("express"),
  cors = require("cors"),
  rateLimit = require("express-rate-limit"),
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

const limiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 5 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // store: ... , // Use an external store for more precise rate limiting
});

app.use(limiter);

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
