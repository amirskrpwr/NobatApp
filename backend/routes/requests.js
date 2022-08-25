const express = require("express");
const checkAuth = require("../middlewares/check-auth");
const checkAdmin = require("../middlewares/check-admin");
const RequestController = require("../controllers/requests");

const router = express.Router();

router.post("", checkAuth, RequestController.createRequest);

router.put("/:id", checkAuth, RequestController.updateRequest);

router.get("/:id", RequestController.getRequsetById);

router.get("", RequestController.getRequsets);

router.delete("/:id", checkAuth, RequestController.deleteRequest);

router.put(
    "/status/:id",
    checkAuth,
    checkAdmin,
    RequestController.updateStatus
);

module.exports = router;