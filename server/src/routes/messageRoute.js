const express = require("express");
const { sendMessage, getMessage } = require("../controllers/messageController");
const router = express.Router();
const upload = require("../middlewares/multerConfig");

router.post("/message/sendMessage", upload.array("images", 5), sendMessage);
router.get(`/message/:sender/:receiver/getMessage`, getMessage);

module.exports = router;
