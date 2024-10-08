const { MongoClient, ServerApiVersion } = require('mongodb');
const mongoose = require("mongoose");
require('dotenv').config();

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Function to connect to the database
const connectDB = async () => {
    // Connect to Database
    mongoose
        .connect(uri)
        .then(() => {
            console.log("Connected to db");
        })
        .catch((err) => {
            console.log("Error:", err.message);
        });

};

module.exports = connectDB;
