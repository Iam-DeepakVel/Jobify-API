const express = require("express");
const {
  getAllStudentProfiles,
  createStudentProfile,
  getSingleStudentProfile,
  updateStudentProfile,
  studentProfileImageUpload,
} = require("../controllers/studentControllers");
const router = express.Router();

const {authenticateUser} = require("../middlewares/authentication");

router
  .route("/")
  .get(authenticateUser, getAllStudentProfiles)
  .post(authenticateUser, createStudentProfile);
router
  .route("/profileImageUpload")
  .post(authenticateUser, studentProfileImageUpload);
router
  .route("/:id")
  .get(authenticateUser, getSingleStudentProfile)
  .patch(authenticateUser, updateStudentProfile);

module.exports = router;
