const Logger = require("../models/Logger");
const geoip = require("geoip-lite");
const UAParser = require("ua-parser-js");

const CreateLogger = async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ message: "Not logged in" });

        const { redirectUrl } = req.body;
        if (!redirectUrl) return res.status(400).json({ message: "redirectUrl required" });

        const logger = await Logger.create({
            userId,
            redicertUrl: redirectUrl,
            Logs: []
        });

        res.json({
            success: true,
            trackingUrl: `/log/${logger._id}`,
            loggerId: logger._id
        });
    } catch (err) {
        console.error("Create Logger Error:", err.message);
        res.status(500).json({ message: err.message });
    }
};

const LogVisitor = async (req, res) => {
    try {
        const { id } = req.params;
        const logger = await Logger.findById(id);
        if (!logger) return res.status(404).send("Logger not found");

        const userId = req.session?.userId || null;

        const IP_Address =
            req.headers["x-forwarded-for"]?.split(",")[0] ||
            req.ip ||
            req.socket?.remoteAddress ||
            req.connection?.remoteAddress;

        const uaString = req.headers["user-agent"];
        const parser = new UAParser(uaString);
        const ua = parser.getResult();

        const geo = geoip.lookup(IP_Address);

        const data = {
            IP_Address,
            UserAgent: uaString,
            device: ua.device?.model || "Unknown",
            os: ua.os?.name || "Unknown",
            browser: ua.browser?.name || "Unknown",
            location: {
                country: geo?.country || null,
                region: geo?.region || null,
                city: geo?.city || null
            },
            method: req.method,
            endpoint: req.originalUrl,
            date: Date.now(),
            userId
        };

        logger.Logs.push(data);
        await logger.save();

        res.redirect(logger.redicertUrl);

    } catch (err) {
        console.error("Log Visitor Error:", err.message);
        res.status(500).send("Internal Server Error");
    }
};

const getLogById = async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ message: "Not logged in" });
        const { loggerId } = req.body;
        if(!loggerId) {
            return res.status(400).json({ mesage: "Logger ID is must."})
        }

        const logger = await Logger.findOne({ _id: loggerId, userId: userId });
        if (!logger) {
            return res.status(404).json({ message: "Logger not found or access denied." });
        }

        res.status(201).json({ message: logger })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

const editRedicertUrl = async (req, res) => {
    try {
        const userId = req.session?.userId;
        if (!userId) return res.status(401).json({ message: "Not logged in" });

        const { loggerId, redicertUrl } = req.body;
        if (!loggerId || !redicertUrl) {
            return res.status(400).json({ message: "Logger ID and RedicertUrl are required." });
        }

        const logger = await Logger.findOne({ _id: loggerId, userId });
        if (!logger) {
            return res.status(404).json({ message: "Logger not found or access denied." });
        }

        logger.redicertUrl = redicertUrl;
        await logger.save();

        res.status(200).json({ message: "RedicertUrl updated successfully.", logger });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteLoggerById = async (req, res) => {
    try {
        const { loggerId} = req.body;
        const userId = req.session?.userId;
        if(!userId) {
            return res.status(401).json({ message: "Not logged in."})
        }
        if(!loggerId) {
            return res.status(400).json({ message: "LoggerID is must."})
        }
        const logger = await Logger.findOne({ _id: loggerId, userId })
        if(!logger) {
            return res.status(404).json({ message: "Logger not found or access denied."})
        }        
        const deleteLogger = await Logger.findByIdAndDelete(logger)

        res.status(201).json({ message: "Logger has been deleted.", deleteLogger})
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

module.exports = {
    CreateLogger,
    LogVisitor,
    getLogById,
    editRedicertUrl,
    deleteLoggerById
};