"use strict";

const path = require("path");
const fs = require("fs");

function autoRender(viewsDir) {
  return function (request, response, next) {
    const rawPath = request.path.replace(/^\//, "") || "index";

    if (rawPath.includes("..") || rawPath.includes("\0")) return next();
    if (rawPath.includes("/")) return next();

    const viewFile = path.resolve(viewsDir, rawPath + ".handlebars");
    const resolvedDir = path.resolve(viewsDir);

    if (!viewFile.startsWith(resolvedDir + path.sep)) return next();
    if (!fs.existsSync(viewFile)) return next();

    const pageTitle = rawPath.charAt(0).toUpperCase() + rawPath.slice(1);
    return response.render(rawPath, { pageTitle });
  };
}

module.exports = autoRender;
