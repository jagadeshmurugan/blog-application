const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
    res.send("Blog Application API is running!");
});

const PORT = process.env.PORT || 5000;

async function startServer() {
    const db = await connectDB();
    app.locals.db = db;

    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

startServer();