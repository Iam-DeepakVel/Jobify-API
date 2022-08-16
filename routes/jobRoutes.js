const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobController");

const {authenticateUser} = require('../middlewares/authentication')

router.route("/").post(authenticateUser,createJob).get(authenticateUser,getAllJobs);
router.route("/:id").get(authenticateUser,getSingleJob).patch(authenticateUser,updateJob).delete(authenticateUser,deleteJob);

module.exports = router;
