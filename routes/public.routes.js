"use strict";
const express = require("express");
const path = require("path");
const router = express.Router();

const logger = require("../middleware/logger");
const validateSlug = require("../middleware/validateSlug");
const autoRender = require("../middleware/autoRender");
const publicController = require("../middleware/public.controller");

router.use(logger);

router.get("/", publicController.home);
router.get("/bookmarks", publicController.listBookmarks);
router.get(
  "/bookmarks/:slug",
  validateSlug("slug"),
  publicController.showBookmark,
);
router.get("/tag/:tagSlug", validateSlug("tagSlug"), publicController.showTag);
router.get("/search", publicController.search);

router.use(autoRender(path.join(__dirname, "../views")));
router.use(publicController.notFound);

module.exports = router;
