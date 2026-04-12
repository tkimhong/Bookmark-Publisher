"use strict";

const { bookmarks, adminUsers } = require("../data/mock");
const config = require("../config/app.config");

// Auth
exports.showLogin = (request, response) => {
  if (request.cookies?.admin_user) return response.redirect("/");

  response.render("admin/login", {
    layout: false,
    pageTitle: "Login – Book It",
  });
};

exports.login = (request, response) => {
  const { username, password } = request.body;
  const user = adminUsers.find(
    (u) => u.username === username && u.password === password,
  );

  if (!user) {
    return response.status(401).render("admin/login", {
      layout: false,
      pageTitle: "Login – Book It",
      error: "Invalid username or password.",
    });
  }

  response.cookie("admin_user", user.username, {
    httpOnly: true,
    sameSite: "lax",
    secure: config.NODE_ENV === "production",
    maxAge: 8 * 60 * 60 * 1000,
  });

  return response.redirect("/");
};

exports.logout = (request, response) => {
  response.clearCookie("admin_user");
  return response.redirect("/login");
};

// Dashboard
exports.dashboard = (request, response) => {
  const total = bookmarks.length;
  const active = bookmarks.filter((b) => !b.isArchived).length;
  const archived = bookmarks.filter((b) => b.isArchived).length;
  const tags = [...new Set(bookmarks.flatMap((b) => b.tags))];

  response.render("admin/dashboard", {
    pageTitle: "Dashboard",
    stats: { total, active, archived, totalTags: tags.length },
    // recent: bookmarks.slice(0, 5),
    recent: [...bookmarks]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5),
  });
};

// Bookmarks list
exports.listBookmarks = (request, response) => {
  response.render("admin/bookmarks", {
    pageTitle: "Manage Bookmarks",
    bookmarks,
  });
};

// New
exports.showNew = (request, response) => {
  response.render("admin/form", {
    pageTitle: "New Bookmark",
    isNew: true,
    bookmark: null,
  });
};

exports.create = (request, response) => {
  const { title, slug, url, description, tags } = request.body;

  const errors = [];
  if (!title || !title.trim()) errors.push("Title is required.");
  if (!url || !/^https?:\/\//.test(url))
    errors.push("URL must start with http:// or https://.");
  if (bookmarks.find((b) => b.url === url))
    errors.push("This URL already exists.");
  if (bookmarks.find((b) => b.slug === slug))
    errors.push("This slug already exists.");

  if (errors.length) {
    return response.status(400).render("admin/form", {
      pageTitle: "New Bookmark",
      isNew: true,
      bookmark: request.body,
      errors,
    });
  }

  const now = new Date().toISOString();
  bookmarks.push({
    id: bookmarks.length ? Math.max(...bookmarks.map((b) => b.id)) + 1 : 1,
    title: title.trim(),
    slug: slug.trim(),
    url: url.trim(),
    description: (description || "").trim(),
    tags: tags
      ? tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean)
      : [],
    isArchived: false,
    createdAt: now,
    updatedAt: now,
  });

  return response.redirect("/bookmarks");
};

// Edit
exports.showEdit = (request, response) => {
  const bookmark = bookmarks.find((b) => b.slug === request.params.slug);

  if (!bookmark) {
    return response.status(404).render("404", {
      pageTitle: "404 – Not Found",
      message: `No bookmark found for "${request.params.slug}".`,
    });
  }

  response.render("admin/form", {
    pageTitle: `Edit: ${bookmark.title}`,
    isNew: false,
    bookmark: { ...bookmark, tags: bookmark.tags.join(", ") },
  });
};

exports.update = (request, response) => {
  const bookmark = bookmarks.find((b) => b.slug === request.params.slug);

  if (!bookmark) {
    return response.status(404).render("404", {
      pageTitle: "404 – Not Found",
      message: `No bookmark found for "${request.params.slug}".`,
    });
  }

  const { title, slug, url, description, tags } = request.body;

  const errors = [];
  if (!title || !title.trim()) errors.push("Title is required.");
  if (!url || !/^https?:\/\//.test(url))
    errors.push("URL must start with http:// or https://.");
  if (bookmarks.find((b) => b.url === url && b.id !== bookmark.id))
    errors.push("This URL already exists.");
  if (bookmarks.find((b) => b.slug === slug && b.id !== bookmark.id))
    errors.push("This slug already exists.");

  if (errors.length) {
    return response.status(400).render("admin/form", {
      pageTitle: `Edit: ${bookmark.title}`,
      isNew: false,
      bookmark: request.body,
      errors,
    });
  }

  bookmark.title = title.trim();
  bookmark.slug = slug.trim();
  bookmark.url = url.trim();
  bookmark.description = (description || "").trim();
  bookmark.tags = tags
    ? tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean)
    : [];
  bookmark.updatedAt = new Date().toISOString();

  return response.redirect("/bookmarks");
};

// Delete
exports.delete = (request, response) => {
  const index = bookmarks.findIndex((b) => b.slug === request.params.slug);

  if (index !== -1) bookmarks.splice(index, 1);

  return response.redirect("/bookmarks");
};

// Archive/Unarchive
exports.archive = (request, response) => {
  const bookmark = bookmarks.find((b) => b.slug === request.params.slug);

  if (bookmark) {
    bookmark.isArchived = true;
    bookmark.updatedAt = new Date().toISOString();
  }

  return response.redirect("/bookmarks");
};

exports.unarchive = (request, response) => {
  const bookmark = bookmarks.find((b) => b.slug === request.params.slug);

  if (bookmark) {
    bookmark.isArchived = false;
    bookmark.updatedAt = new Date().toISOString();
  }

  return response.redirect("/bookmarks");
};
