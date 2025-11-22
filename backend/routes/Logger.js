const express = require("express");
const { CreateLogger, LogVisitor, getLogById, editRedicertUrl, deleteLoggerById } = require("../controllers/Logger");
const { isAuth } = require("../middlewares/Session");
const { createLimiter, viewLimiter } = require("../middlewares/Limiter");

const router = express.Router();

router.post("/create", createLimiter, isAuth, CreateLogger);
router.get("/log/:id", viewLimiter, LogVisitor);
router.post("/get", viewLimiter, isAuth, getLogById)
router.post("/edit", isAuth, editRedicertUrl)
router.post("/delete", viewLimiter, isAuth, deleteLoggerById)

module.exports = router;