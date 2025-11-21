const express = require("express");
const { sendMessage, getMessage } = require("../controllers/messageController");
const router = express.Router();

router.post("/message/sendMessage", sendMessage);
router.get("/message/getMessage", getMessage);

module.exports = router;
