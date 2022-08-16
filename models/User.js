const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide the name!"],
      minlength: 3,
      maxlength: 30,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Please provide the email!"],
      unique: true,
      trim: true,
      validate: {
        validator: validator.isEmail,
        msg: "Please enter the valid email",
      },
    },
    password: {
      type: String,
      required: [true, "Please provide the password!"],
      minlength: [6, "Use 6 characters or more for your password"],
    },
    isOtpVerified:{
      type:Boolean,
      default:false
    },
    isForgotPasswordVerified:{
      type:Boolean,
      default:false
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  { timestamps: true }
);


userSchema.pre("save", async function () {
  if(!this.isModified('password'))return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  const isValid = await bcrypt.compare(candidatePassword, this.password);
  return isValid;
};

module.exports = mongoose.model("User", userSchema);
