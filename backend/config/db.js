const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const db = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URL
    );
    console.log("MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection failed:", err);
  }
};

module.exports = db;