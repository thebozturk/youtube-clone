const express = require("express");
const User = require("../controllers/User");

const router = express.Router();
const Controller = new User();

router.post("/signup", Controller.signup);
router.post("/signin", Controller.signin);
router.post("/password-reset", Controller.forgotPassword);

module.exports = router;
