const mongoose = require("mongoose")

const LoggerSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        req: "Users",
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
            device: String,
            os: String,
            browser: String,
            location: {
                country: String,
                region: String,
                city: String
            },
            method: String,
            endpoint: String,
            status: Number,
            suspicious: Boolean,
            date: { type: Date, default: Date.now() }
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Logger", LoggerSchema)