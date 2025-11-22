const User = require("../models/User")

const getAllUsers = async (req, res) => {
    try {
        const allUsers = await User.find()
        res.status(201).json(allUsers)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const banUser = async (req, res) => {
    try {
        const { userId } = req.body;
        if(!userId) {
            return res.status(400).json({ message: "User ID is required." })
        }
        const user = await User.findById(userId)
        if(!user) {
            return res.status(400).json({ message: "User not found."})
        }
        const banned = await User.findByIdAndUpdate(userId, { isRole: "banned"})

        res.status(201).json({ message: "User has been banned.", banned})
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const removeBanRole = async(req,res) => {
    try {
        const { userId } = req.body;
        if(!userId) {
            return res.status(400).json({ message: "UserID is required."})
        }
        const user = await User.findById(userId)

        if(!user) {
            return res.status(404).json({ message: "User not found."})
        }
        const removeSuspect = await User.findByIdAndUpdate(userId, { isRole: "User"})
        
        res.status(201).json({ message: "User has been removed from suspects.", removeSuspect})
    } catch (error) {
        res.status(500).json({ error })
    }
}

module.exports = {
    getAllUsers,
    banUser,
    removeBanRole
}