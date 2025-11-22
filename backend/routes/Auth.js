const express = require("express")
const validator = require("@tdogan/validator")
const { CreateAuth, Login, me, logout } = require("../controllers/Auth")

const router = express.Router()

router.post("/create", validator({
    email: { required: true, minLength: 6 },
    username: { required: true, minLength: 3 },
    password: { required: true, minLength: 6 }
}), CreateAuth)

router.post("/login", Login)
router.get("/me", me)
router.get("/logout", logout)

module.exports = router