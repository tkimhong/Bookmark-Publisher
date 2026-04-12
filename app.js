"use strict";

const express = require("express");
const vhost = require("vhost");
const path = require("path");
const cookieParser = require("cookie-parser");
const { engine } = require("express-handlebars");

const config = require("./config/app.config");
const publicRoutes = require("./routes/public.routes");
const adminRoutes = require("./routes/admin.routes");

// Shared HBS helpers
const hbsHelpers = {
  currentYear: () => new Date().getFullYear(),
  formatDate: (dateStr) =>
    new Date(dateStr).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
};

// Shared static files
const staticFiles = express.static(path.join(__dirname, "public"));

// publicApp
const publicApp = express();

publicApp.engine(
  "handlebars",
  engine({
    defaultLayout: "public",
    extname: ".handlebars",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: hbsHelpers,
  }),
);
publicApp.set("view engine", "handlebars");
publicApp.set("views", path.join(__dirname, "views"));

publicApp.use(staticFiles);
publicApp.use(express.urlencoded({ extended: false }));
publicApp.use("/", publicRoutes);

// adminApp
const adminApp = express();

adminApp.engine(
  "handlebars",
  engine({
    defaultLayout: "admin",
    extname: ".handlebars",
    layoutsDir: path.join(__dirname, "views/layouts"),
    partialsDir: path.join(__dirname, "views/partials"),
    helpers: hbsHelpers,
  }),
);
adminApp.set("view engine", "handlebars");
adminApp.set("views", path.join(__dirname, "views"));

adminApp.use(staticFiles);
adminApp.use(express.urlencoded({ extended: false }));
adminApp.use(cookieParser());
adminApp.use("/", adminRoutes);

// Main app - vhost dispatcher
const app = express();

app.use(vhost("admin." + config.DOMAIN, adminApp));
app.use(publicApp);

// Global error handler
// eslint-disable-next-line no-unused-vars
app.use((error, request, response, next) => {
  console.error("[ERROR]", error.message);
  response
    .status(500)
    .send("<h1>500 - Internal Server Error</h1><p>" + error.message + "</p>");
});

// Start server
app.listen(config.PORT, () => {
  console.log(`\nBook It running:`);
  console.log(`Public: http://${config.DOMAIN}:${config.PORT}`);
  console.log(`Admin: http://admin.${config.DOMAIN}:${config.PORT}`);
  console.log(`\nAdmin login:`);
  console.log(`username: admin    password: admin123`);
});

module.exports = app;
