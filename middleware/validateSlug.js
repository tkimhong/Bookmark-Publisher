"use strict";

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function validateSlug(paramName) {
  return function (request, response, next) {
    const slug = request.params[paramName];

    if (!slug || !SLUG_PATTERN.test(slug)) {
      return response.status(400).render("404", {
        pageTitle: "Invalid URL",
        message: `"${slug}" is not a valid URL segment.`,
      });
    }

    next();
  };
}

module.exports = validateSlug;
