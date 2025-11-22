const CheckUserAgent = (req,res,next) => {
    const badAgents = ["curl", "wget", "python", "scrapy", "bot", "spider", "postmanruntime"];
    const agent = (req.headers["user-agent"] || "").toLowerCase();

    if(badAgents.some(bad => agent.includes(bad))) {
        return res.status(403).json({ message: "Automated requests are not allowed." });
    }
    next();
}

module.exports = { CheckUserAgent }