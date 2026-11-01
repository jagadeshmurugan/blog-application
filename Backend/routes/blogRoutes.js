const express = require("express");
const router = express.Router();

const { createBlog } = require("../controllers/blogController");

// Create Blog API
router.post("/", createBlog);

module.exports = router;