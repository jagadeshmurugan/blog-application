const express = require("express");
const router = express.Router();

const {
    createBlog,
    getAllBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

// Create Blog API
router.post("/", createBlog);

// Get All Blogs API
router.get("/", getAllBlogs);

// Get Single Blog API
router.get("/:id", getBlogById);

router.put("/:id", updateBlog);

router.delete("/:id", deleteBlog);

module.exports = router;