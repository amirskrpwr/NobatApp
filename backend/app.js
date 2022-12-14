const express = require("express");
const bodyParser = require("body-parser");

const requestsRoutes = require("./routes/requests");
const userRoutes = require("./routes/user");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-headers",
        "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, PUT, DELETE, OPTIONS"
    );
    next();
});

app.use("/api/requests", requestsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;