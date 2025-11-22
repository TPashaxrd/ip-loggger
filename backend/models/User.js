const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    IP_Address: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isRole:{
        type: String,
        default: "User"
    },
    lastLogins: [
        {
            IP_Address: { type: String, required: true},
            date: { type: Date, default: Date.now()}
        }
    ],
    resetPasswordToken: String,
    resetPasswordExpire : Date,
    isBanned: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Users", UserSchema)