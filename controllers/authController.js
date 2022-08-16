const User = require("../models/User");
const customErr = require("../errors");
const { StatusCodes } = require("http-status-codes");
const utils = require("../utils");
const jwt = require("jsonwebtoken");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    throw new customErr.BadRequestError(`Please provide your credentials!`);
  }

  const emailAlreadyExists = await User.findOne({ email });
  if (emailAlreadyExists) {
    throw new customErr.BadRequestError(`Email Already Exists`);
  }

  const otp = Math.floor(100000 + Math.random() * 900000);
  
  const role = await User.countDocuments({}) === 0? 'admin' : 'user';
  
  const user = await User.create({ name, email, password,role });

  const otpToken = jwt.sign(
    { otpNumber: otp, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: 300 }
  );
  res.cookie("verificationToken", otpToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 5,
    signed: true,
  });
  utils.sendVerificationEmail({
    name: user.name,
    email: user.email,
    otpNumber: otp,
  });
  res.status(StatusCodes.CREATED).json({ user });
};

const verifyEmail = async (req, res) => {
  const { otp } = req.body;
  const verificationToken = req.signedCookies.verificationToken;
  const otpPayload = jwt.verify(verificationToken, process.env.JWT_SECRET);
  if (!otp) {
    throw new customErr.BadRequestError(`Please enter the otp`);
  }
  const user = await User.findOne({ email: otpPayload.email });
  if (!user) {
    throw new customErr.UnauthenticatedError(`Authentication Invalid`);
  }
  if (Number(otp) !== otpPayload.otpNumber) {
    throw new customErr.UnauthenticatedError(
      `Inavlid OTP! PLease Enter correct OTP`
    );
  }
  utils.sendRegistrationSuccessfullEmail({
    name: user.name,
    email: user.email,
  });

  user.isOtpVerified = true;
  await user.save();
  res.cookie("verificationToken", 'Verified', {
    httpOnly: true,
    expires:new Date(Date.now())
  });
  res
    .status(StatusCodes.OK)
    .json({ msg: "Successfully Verified Your Email! Please head to Login" });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new customErr.BadRequestError(`Please provide your credentials`);
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new customErr.BadRequestError(`Invalid credentials`);
  }

  const pass = await user.comparePassword(password);

  if (!pass) {
    throw new customErr.BadRequestError(`Invalid credentials`);
  }

  if (!user.isOtpVerified) {
    throw new customErr.UnauthenticatedError(`Please verify your Email`);
  }

  //creating payload
  const payload = { userId: user._id, name: user.name , role:user.role };

  utils.attachCookiesToResponse({ res, user: payload });

  res
    .status(StatusCodes.OK)
    .json({ name: user.name, email: user.email, userId: user._id });
};

//Sending Email
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new customErr.BadRequestError(`Please Enter your verified Email`);
  }
  const user = await User.findOne({ email });
  if (user) {
    const otp = Math.floor(100000 + Math.random() * 900000);
    const ForgotPassToken = jwt.sign(
      { otpNumber: otp, email: user.email },
      process.env.JWT_SECRET
    );
    res.cookie("ForgotPassToken", ForgotPassToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 5,
      signed: true,
    });
    utils.sendforgotPasswordEmail({
      name: user.name,
      email: user.email,
      otpNumber: otp,
    });
  }
  res
    .status(StatusCodes.OK)
    .json({ msg: "Please check your verified Email to Reset Password" });
};

//Verify OTP correct or Not
const verifyOtpForgotPassword = async (req, res) => {
  const { otp } = req.body;
  if(!otp){
    throw new customErr.BadRequestError(`Please enter the OTP`)
  }
  const ForgotPassToken = req.signedCookies.ForgotPassToken;
  const ForgotPassPayload = jwt.verify(ForgotPassToken, process.env.JWT_SECRET);
  
  //Convert otp to number while checking bcoz it will come as object
  if (Number(otp) !== ForgotPassPayload.otpNumber) {
    throw new customErr.UnauthenticatedError(
      `Please provide correct OTP to Reset Your Password`
    );
  }
  const user = await User.findOne({ email: ForgotPassPayload.email });
  user.isForgotPasswordVerified = true;
  await user.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Successfully verified !Now you can Change your password" });
};


const resetPassword = async (req, res) => {
  const { newPassword, newPasswordAgain } = req.body;
  const ForgotPassToken = req.signedCookies.ForgotPassToken;
  const ForgotPassPayload = jwt.verify(ForgotPassToken, process.env.JWT_SECRET);
  
  const user = await User.findOne({ email: ForgotPassPayload.email });
  if (!user.isForgotPasswordVerified) {
    throw new customErr.UnauthenticatedError(
      `Please check your verified email for the otp Verification`
    );
  }
  if (newPassword !== newPasswordAgain) {
    throw new customErr.UnauthenticatedError(`Password Doesn't Match`);
  }

  user.password = newPassword;
  user.isForgotPasswordVerified = false;
  await user.save();
  utils.passwordResetSuccessfullEmail({name:user.name,email:user.email})
  res.status(StatusCodes.OK).json({ msg: "Password Succesfully Changed!" });
};

const logout = async (req, res) => {
  res.cookie("accessToken", "logout", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(StatusCodes.OK).json({ msg: "User logged Out" });
};

module.exports = {
  register,
  verifyEmail,
  login,
  logout,
  forgotPassword,
  verifyOtpForgotPassword,
  resetPassword,
};
