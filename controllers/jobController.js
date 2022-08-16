const Job = require("../models/Job");
const Company = require("../models/Company");
const customErr = require("../errors");
const { StatusCodes } = require("http-status-codes");

const createJob = async (req, res) => {
  const company = await Company.findOne({ user: req.user.userId });
  req.body.company = company._id;
  const job = await Job.create(req.body);
  const populatedJob = await Job.findOne({ _id: job._id });

  res.status(StatusCodes.CREATED).json({ populatedJob });
};

const getAllJobs = async (req, res) => {
  const jobs = await Job.find({}).populate('company');
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};

const getSingleJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id }).populate({
    path: "company",
    select: "-companyName",
  });
  if (!job) {
    throw new customErr.NotFoundError(`No Job found with id ${req.params.id}`);
  }

  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const company = await Company.findOne({ user: req.user.userId });
  const job = await Job.findOne({ _id: req.params.id });

  if (job.company.toString() !== company._id.toString()) {
    throw new customErr.UnauthorizedError(
      `You dont have permission to access this route`
    );
  }

  const updatedJob = await Job.findOneAndUpdate(
    { _id: req.params.id },
    req.body,
    {
      runValidators: true,
      new: true,
    }
  );

  res.status(StatusCodes.OK).json({ updatedJob });
};

const deleteJob = async (req, res) => {
  const company = await Company.findOne({ user: req.user.userId });
  const job = await Job.findOne({ _id: req.params.id });

  if (job.company.toString() !== company._id.toString()) {
    throw new customErr.UnauthorizedError(
      `You dont have permission to access this route`
    );
  }

  await Job.findOneAndDelete({ _id: req.params.id });
  res.status(StatusCodes.OK).json({ msg: "Job deleted Successfully" });
};


module.exports = {
  createJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
};
