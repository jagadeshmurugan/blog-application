const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/blogs", blogRoutes);

app.get("/", (req, res) => {
    res.send("Blog Application API is running!");
});

const PORT = 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});