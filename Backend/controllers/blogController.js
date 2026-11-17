

// Create Blog
const createBlog = async (req, res) => {
    try {
        const { title, content, category, imageUrl } = req.body;

        // Check required fields
        if (!title || !content || !category) {
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
            authorId: req.user.id,
            authorName: req.user.name,
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

// Get Logged-in User Blogs
const getMyBlogs = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const blogs = db.collection("blogs");

        const myBlogs = await blogs.find({
            authorId: req.user.id
        }).toArray();

        res.status(200).json({
            message: "User blogs retrieved successfully",
            blogs: myBlogs
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
const updateBlog = async (req, res) => {
    try {
        const { title, content, category, imageUrl } = req.body;

        if (!title || !content || !category) {
            return res.status(400).json({
                message: "Title, content and category are required"
            });
        }

        if (title.trim().length < 5) {
            return res.status(400).json({
                message: "Title must contain at least 5 characters"
            });
        }

        if (content.trim().length < 50) {
            return res.status(400).json({
                message: "Content must contain at least 50 characters"
            });
        }

        const db = req.app.locals.db;
        const blogs = db.collection("blogs");

        const result = await blogs.updateOne(
            {
                id: Number(req.params.id),
                authorId: req.user.id
            },
            {
                $set: {
                    title: title.trim(),
                    content: content.trim(),
                    category: category.trim(),
                    imageUrl: imageUrl || "",
                    updatedAt: new Date()
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        const updatedBlog = await blogs.findOne({
            id: Number(req.params.id)
        });

        res.status(200).json({
            message: "Blog updated successfully",
            blog: updatedBlog
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error"
        });
    }
};
const deleteBlog = async (req, res) => {
    try {
        const db = req.app.locals.db;
        const blogs = db.collection("blogs");

        const result = await blogs.deleteOne({
            id: Number(req.params.id),
            authorId: req.user.id
        });

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: "Blog not found"
            });
        }

        res.status(200).json({
            message: "Blog deleted successfully"
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
    getMyBlogs,
    getBlogById,
    updateBlog,
    deleteBlog
};