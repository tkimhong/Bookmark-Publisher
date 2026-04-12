"use strict";

function logger(request, response, next) {
  const timestamp = new Date().toISOString();
  const method = request.method.padEnd(7);
  const url = request.originalURL || request.url;

  console.log(`[${timestamp}] ${method} ${url}`);

  next();
}

module.exports = logger;
