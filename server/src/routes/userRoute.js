const {
  userRegistration,
  userLogin,
  userSearchByName,
  fetchAllUsers,
} = require("../controllers/userController");

const express = require("express");
const router = express.Router();

router.post("/user/userRegistration", userRegistration);
router.post("/user/userLogin", userLogin);
router.get("/user/userSearchByName", userSearchByName);
router.get("/user/fetchAllUsers", fetchAllUsers);
module.exports = router;
