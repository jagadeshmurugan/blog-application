const express = require("express");
const router = express.Router();

const {
    createBlog,
    getAllBlogs,
    getBlogById
} = require("../controllers/blogController");

// Create Blog API
router.post("/", createBlog);

// Get All Blogs API
router.get("/", getAllBlogs);

// Get Single Blog API
router.get("/:id", getBlogById);

module.exports = router;