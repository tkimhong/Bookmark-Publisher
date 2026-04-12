"use strict";

function adminAuth(request, response, next) {
  const username = request.cookies?.admin_user;
  const user = adminUsers.find((u) => u.username === username);

  if (!user) {
    if (request.accepts("html")) {
      return response.redirect("/login");
    }
    return response.status(401).json({ error: "Unauthorized" });
  }

  request.adminUser = user;
  response.locals.adminUser = user;

  next();
}

module.exports = adminAuth;
