"use strict";

const express = require("express");
const router = express.Router();

const logger = require("../middleware/logger");
const adminAuth = require("../middleware/adminAuth");
const validateSlug = require("../middleware/validateSlug");
const adminController = require("../controllers/admin.controller");

router.use(logger);

// Public auth routes
router.get("/login", adminController.showLogin);
router.post("/login", adminController.login);

// Protected routes
router.use(adminAuth);
router.post("/logout", adminController.logout);

router.get("/", adminController.dashboard);
router.get("/bookmarks", adminController.listBookmarks);

router.get("/bookmarks/new", adminController.showNew);
router.post("/bookmarks/new", adminController.create);

router.get(
  "/bookmarks/:slug/edit",
  validateSlug("slug"),
  adminController.showEdit,
);
router.post(
  "/bookmarks/:slug/edit",
  validateSlug("slug"),
  adminController.update,
);

router.post(
  "/bookmarks/:slug/delete",
  validateSlug("slug"),
  adminController.delete,
);
router.post(
  "/bookmarks/:slug/archive",
  validateSlug("slug"),
  adminController.archive,
);
router.post(
  "/bookmarks/:slug/unarchive",
  validateSlug("slug"),
  adminController.unarchive,
);

module.exports = router;
