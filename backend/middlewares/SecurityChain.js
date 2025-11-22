const hpp = require("hpp")
const helmet = require("helmet")
const morgan = require("morgan")
const fs = require("fs")
const path = require("path")
const rfs = require("rotating-file-stream")

const applySecurityMiddlewares = (app) => {
    app.use(helmet({
        contentSecurityPolicy: false,
        crossOriginEmbedderPolicy: false
    }))
    app.use(hpp())
    app.disable("x-powered-by")
    app.use(helmet.referrerPolicy({ policy: "no-referrer" }))
    app.use(helmet.frameguard({ action: "deny" }))
}

const applyLoggingMiddleware = (app) => {
    const logDirectory = path.join(__dirname, "../logs")

    if (!fs.existsSync(logDirectory)) {
        fs.mkdirSync(logDirectory)
    }

    if (process.env.NODE_ENV === "development") {
        app.use(morgan("dev"))
    } else {
    const stream = rfs.createStream((time, index) => {
        const date = new Date(time || Date.now())
        const year = date.getFullYear()
        const month = String(date.getMonth() + 1).padStart(2, "0")
        const day = String(date.getDate()).padStart(2, "0")
        return `access-${year}-${month}-${day}${index ? `-${index}` : ""}.log.gz`
            }, {
            interval: "1d",
            path: logDirectory,
            compress: "gzip"
        })


        app.use(morgan("combined", { stream }))
    }
}

module.exports = {
    applySecurityMiddlewares,
    applyLoggingMiddleware
}