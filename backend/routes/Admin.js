const express = require("express")
const { getAllLogs } = require("../controllers/AdminController")

const router = express.Router()

router.get("/all-logs", getAllLogs)

module.exports = router