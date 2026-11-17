const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
    createBlog,
    getAllBlogs,
    getMyBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
} = require("../controllers/blogController");

// Create Blog API
router.post("/", authMiddleware, createBlog);

// Get All Blogs API
router.get("/", getAllBlogs);
router.get("/my", authMiddleware, getMyBlogs);

// Get Single Blog API
router.get("/:id", getBlogById);

router.put("/:id", authMiddleware, updateBlog);

router.delete("/:id", authMiddleware, deleteBlog);

module.exports = router;