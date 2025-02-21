const express = require("express");
const { sendVerificationEmail, sendForgotPasswordEmail,verifyCode } = require("../controllers/authController");

const router = express.Router();

router.post("/send-verification-email", sendVerificationEmail);
router.post("/send-forgot-password-email", sendForgotPasswordEmail);
router.post("/verify-code", verifyCode);
module.exports = router;
