const express = require("express")
require("dotenv").config()
const db = require("./config/db")
const { applySecurityMiddlewares, applyLoggingMiddleware } = require("./middlewares/SecurityChain")
const cors = require("cors")
const MongoStore = require("connect-mongo")
const session = require("express-session")
const AuthRoutes = require("./routes/Auth")
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

applyLoggingMiddleware(app)
applySecurityMiddlewares(app)

// app.get("/health", async (req, res) => {
//     const dbStatus = mongoose.connection.readyState === 1 ? "up" : "down";
//     res.json({ status: "ok", db: dbStatus})
// })

// R0UTES's
app.use("/api/auth", AuthRoutes)

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`)
})