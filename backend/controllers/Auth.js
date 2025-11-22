const User = require("../models/User");
const bcrypt = require("bcryptjs")

const CreateAuth = async (req, res) => {
    try {
        const { username, password, email } = req.body;
        if(!username || !password || !email) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const IP_Address = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.connection.remoteAddress;
        // I'll use validator after I update module lol


        // TAKE IP In req.headers
        const exist = await User.findOne({ email })
        if(exist) return res.status(400).json({ message: "This email already using."})
        
        const hashedPassword = await bcrypt.hash(password, 10)
        const newUser = await User({
            username,
            IP_Address,
            password: hashedPassword,
            email
        })

        await newUser.save()

        res.status(201).json({ message: "Successfully registered.", newUser})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const Login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email })
        const IP_Address = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || req.connection.remoteAddress;
        if(!user) {
            return res.status(400).json({ message: "Invalid credentials"})
        }
        const match = await bcrypt.compare(password, user.password)
        if(!match) {
            return res.status(400).json({ message: "Invalid password."})
        }
        // const checkBan = await user

        user.lastLogins.push({
            IP_Address
        })

        await user.save()

        req.session.userId = user._id;
        res.json({ message: "Logged in", user: { id: user._id, username: user.username, email}})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const me = async (req, res) => {
    try {
        const userId = req.session.userId;
        if(!userId) return res.status(401).json({ message: "Not logged in."})
        const user = await User.findById(userId).select("-password")
        if(!user) return res.status(404).json({ message: "User not found. "})
        
        res.status(200).json({ user })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const logout = async (req, res) => {
    if (req.session.userId) {
        req.session.destroy(err => {
            if (err) {
                return res.status(500).json({ message: "Error logging out" });
            }
            res.clearCookie("connect.sid");
            res.status(200).json({ message: "Logged out successfully" }); 
        });
    } else {
        res.status(400).json({ message: "No active session found." });
    }
};

module.exports = {
    CreateAuth,
    Login,
    me,
    logout
}