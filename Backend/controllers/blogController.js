const { blogs } = require("../data/memoryStore");

// Create Blog
const createBlog = (req, res) => {
    try {
        const { title, content, category, imageUrl, authorId, authorName } = req.body;

        // Check required fields
        if (!title || !content || !category || !authorId || !authorName) {
            return res.status(400).json({
                message: "All required fields must be provided"
            });
        }

        // Check title length
        if (title.trim().length < 5) {
            return res.status(400).json({
                message: "Title must contain at least 5 characters"
            });
        }

        // Check content length
        if (content.trim().length < 50) {
            return res.status(400).json({
                message: "Content must contain at least 50 characters"
            });
        }

        // Create new blog
        const newBlog = {
            id: Date.now(),
            title: title.trim(),
            content: content.trim(),
            category: category.trim(),
            imageUrl: imageUrl || "",
            authorId,
            authorName,
            createdAt: new Date()
        };

        // Store blog
        blogs.push(newBlog);

        // Send response
        res.status(201).json({
            message: "Blog created successfully",
            blog: newBlog
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Export function
module.exports = {
    createBlog
};