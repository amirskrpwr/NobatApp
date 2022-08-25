const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        if (
            decodedToken.email === "admin@mail.com" &&
            decodedToken.password === "admin"
        ) {
            req.userData = { isAdmin: true };
            next();
        } else {
            res.status(401).json({ message: "you are not authenticated!" });
        }
    } catch (error) {
        res.status(401).json({ message: "you are not authenticated!" });
    }
};