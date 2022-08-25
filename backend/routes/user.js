const express = require("express");

const UserController = require("../controllers/user.js");

const router = express.Router();

router.post("/signup", UserController.register);

router.post("/login", UserController.login);

module.exports = router;
