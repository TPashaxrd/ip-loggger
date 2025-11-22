const express = require("express")
const validator = require("@tdogan/validator")
const { CreateAuth, Login, me, logout } = require("../controllers/Auth")
const { authLimiter, loginLimiter, generalAuthLimiter } = require("../middlewares/Limiter")

const router = express.Router()

router.post("/create", validator({
    email: { required: true, minLength: 6 },
    username: { required: true, minLength: 3 },
    password: { required: true, minLength: 6 }
}), authLimiter, CreateAuth)

router.post("/login", loginLimiter, Login)
router.get("/me", generalAuthLimiter, me)
router.get("/logout", generalAuthLimiter, logout)

module.exports = router