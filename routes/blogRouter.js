const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const blogController = require("../controllers/blogController");

router.post("/login", adminController.handleLogin);

router.put("/create-blog/:id", blogController.createBlog);

router.get("/get-all-blogs", blogController.getAllBlogs);

router.get("/get-all-blogs/:id", blogController.getOneBlog);

router.get("/get-all-drafts/:id", blogController.getOneDraft);

router.put("/save-blog/:id", blogController.saveDraft);

router.get("/get-all-drafts", blogController.getAllDrafts);

router.delete("/delete-draft/:id", blogController.deleteDraft);

router.delete("/delete-blog/:id", blogController.deleteBlog);

router.get("/blog-search", blogController.blogSearch);

router.get("/unpublish/:id", blogController.unPublish);

router.get("/publish/:id", blogController.publishDraft);

router.get("/drafts-search", blogController.draftSearch);
// router.post('/test', blogController.testUpload)
module.exports = router;
