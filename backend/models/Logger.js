const mongoose = require("mongoose");

const LoggerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true
    },
    redicertUrl: {
        type: String,
        required: true
    },
    Logs: [
        {
            IP_Address: { type: String, required: true },
            UserAgent: { type: String, required: true },
            device: { type: String },
            os: { type: String },
            browser: { type: String },
            location: {
                country: { type: String },
                region: { type: String },
                city: { type: String }
            },
            method: { type: String },
            endpoint: { type: String },
            date: { type: Date, default: Date.now }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Logger", LoggerSchema);