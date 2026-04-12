"use strict";

const { bookmarks } = require("../data/mock");

exports.home = (request, response) => {
  const recent = bookmarks.filter((b) => !b.isArchived).slice(0, 3);

  response.render("index", {
    pageTitle: "Book It",
    bookmarks: recent,
  });
};

exports.listBookmarks = (request, response) => {
  const active = bookmarks.filter((b) => !b.isArchived);

  response.render("bookmarks/list", {
    pageTitle: "All Bookmarks",
    bookmarks: active,
  });
};

exports.showBookmark = (request, response) => {
  const bookmark = bookmarks.find(
    (b) => b.slug === request.params.slug && !b.isArchived,
  );

  if (!bookmark) {
    return response.status(404).render("404", {
      pageTitle: "404 - Not Found",
      message: `No bookmark found for "${request.params.slug}".`,
    });
  }

  response.render("bookmarks/detail", {
    pageTitle: bookmark.title,
    bookmark,
  });
};

exports.showTag = (request, response) => {
  const { tagSlug } = request.params;
  const filtered = bookmarks.filter(
    (b) => !b.isArchived && b.tags.includes(tagSlug),
  );

  response.render("bookmarks/tag", {
    pageTitle: `Tag:${tagSlug}`,
    tagSlug,
    bookmarks: filtered,
  });
};

exports.search = (request, response) => {
  const q = (request.query.q || "").trim().toLowerCase();
  const results = q
    ? bookmarks.filter(
        (b) => !b.isArchived && b.title.toLowerCase().includes(q),
      )
    : [];

  response.render("bookmarks/search", {
    pageTitle: q ? `Search:${q}` : "Search",
    q,
    bookmarks: results,
  });
};

exports.notFound = (request, response) => {
  response.status(404).render("404", {
    pageTitle: "404 - Page Not Found",
    message: "The page you are looking for does not exist.",
  });
};
