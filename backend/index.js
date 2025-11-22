const express = require("express")
require("dotenv").config()
const db = require("./config/db")
const { applySecurityMiddlewares, applyLoggingMiddleware } = require("./middlewares/SecurityChain")
const cors = require("cors")
const MongoStore = require("connect-mongo")
const session = require("express-session")
const AuthRoutes = require("./routes/Auth")
const LoggerRoutes = require("./routes/Logger")
const AdminRoutes = require("./routes/Admin")
const { CheckUserAgent } = require("./middlewares/UserAgentCheck")
const app = express()

app.set("trust proxy", 0)

db()

const allowedOrigins = [
    "http://localhost:5173"
]

app.use(cors({
    origin: (origin, callback) => {
        if(!origin || allowedOrigins.includes(origin)) {
            callback(null, true)
        } else {
            callback(new Error("Cors policy does not allow access from the specified Origin."))
        }
    },
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions"
})


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}))

// app.use(CheckUserAgent)
applyLoggingMiddleware(app)
applySecurityMiddlewares(app)
// MIDDLEWAREs

// app.get("/health", async (req, res) => {
//     const dbStatus = mongoose.connection.readyState === 1 ? "up" : "down";
//     res.json({ status: "ok", db: dbStatus})
// })

// R0UTES's
app.use("/api/auth", AuthRoutes)
app.use("/api/logger", LoggerRoutes)
app.use("/api/admin", AdminRoutes)
const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`)
})