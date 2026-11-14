

// Create Blog
const createBlog = async (req, res) => {
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

        const db = req.app.locals.db;
        const blogs = db.collection("blogs");
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
        await blogs.insertOne(newBlog);

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

// Get All Blogs
const getAllBlogs = async (req, res) => {
    try {
        const db = req.app.locals.db;

        const blogs = db.collection("blogs");

        const allBlogs = await blogs.find().toArray();

        res.status(200).json({
            message: "Blogs retrieved successfully",
            blogs: allBlogs
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Get Single Blog
const getBlogById = async (req, res) => {
    try {
        const db = req.app.locals.db;

        const blogs = db.collection("blogs");

        const blog = await blogs.findOne({
            id: Number(req.params.id)
        });

        if (!blog) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.status(200).json({
            message: "Blog retrieved successfully",
            blog
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};

// Export function
module.exports = {
    createBlog,
    getAllBlogs,
    getBlogById
};