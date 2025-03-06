const jwt = require('jsonwebtoken');

function verifyAdmin(req, res, next) {
    const token = req.headers.authorization.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.admin = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}

module.exports = { verifyAdmin };
