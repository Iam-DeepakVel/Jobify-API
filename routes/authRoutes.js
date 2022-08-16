const express = require("express");
const router = express.Router();

const { register, verifyEmail ,login, logout,forgotPassword,resetPassword ,verifyOtpForgotPassword} = require("../controllers/authController");

router.route("/register").post(register);
router.route("/verifyEmail").post(verifyEmail);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route('/forgotPassword').post(forgotPassword)
router.route('/verifyPassword').post(verifyOtpForgotPassword)
router.route('/resetPassword').post(resetPassword)

module.exports = router;
