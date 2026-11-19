const dns = require("dns");
dns.setServers(["8.8.8.8"]);

const { MongoClient } = require("mongodb");

require("dotenv").config();

const client = new MongoClient(process.env.MONGODB_URI);

async function connectDB() {
    try {
        await client.connect();

        console.log("MongoDB Connected Successfully!");

        return client.db("BlogDB");

    } catch (error) {
        console.error("MongoDB Connection Failed:", error.message);
        process.exit(1);
    }
}

module.exports = connectDB;