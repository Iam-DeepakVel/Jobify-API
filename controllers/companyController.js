const Company = require("../models/Company");
const customErr = require("../errors");
const { StatusCodes } = require("http-status-codes");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const createCompanyProfile = async (req, res) => {
  //One user should have one profile
  const alreadyExists = await Company.findOne({ user: req.user.userId });
  if (alreadyExists) {
    throw new customErr.BadRequestError(`Profile already Exists`);
  }
  req.body.user = req.user.userId;
  const company = await Company.create(req.body);
  res.status(StatusCodes.CREATED).json({ company });
};

const getAllCompanyProfile = async (req, res) => {
  const companies = await Company.find({});
  res.status(StatusCodes.OK).json({ companies, count: companies.length });
};

const getSingleCompanyProfile = async (req, res) => {
  const company = await Company.findOne({ _id: req.params.id });
  if(!company){
    throw new customErr.NotFoundError(`No company found with id ${req.params.id}`)
  }
  res.status(StatusCodes.OK).json({ company });
};

const updateCompanyProfile = async (req, res) => {
  //From this we can get Company Id
  const currentUserCompanyProfile = await Company.findOne({user:req.user.userId})
  
  if(currentUserCompanyProfile._id.toString() !== req.params.id){
    throw new customErr.UnauthorizedError(`You dont have Permission to access this route`)
  }
  
  const company = await Company.findOneAndUpdate({_id:req.params.id},req.body,{
    new:true,
    runValidators:true,
  })

  res.status(StatusCodes.OK).json({company})
};

const uploadCompanyImage = async (req, res) => {
  if (!req.files) {
    throw new customErr.BadRequestError(`Please Upload Image`);
  }

  if (!req.files.image.mimetype.startsWith("image")) {
    throw new customErr.BadRequestError(`Upload only Image`);
  }

  let maxSize = 1024 * 1024 * 5;
  if (req.files.image.size > maxSize) {
    throw new customErr.BadRequestError(`Image size cannot exceed 5 MB`);
  }

  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "jobify-CompanyProfileImages",
    }
  );

  fs.unlinkSync(req.files.image.tempFilePath);

  const company = await Company.findOne({ user: req.user.userId });
  company.image = result.secure_url;
  await company.save();

  return res.status(StatusCodes.OK).json({ img: { src: result.secure_url } });
};

module.exports = {
  createCompanyProfile,
  getAllCompanyProfile,
  getSingleCompanyProfile,
  updateCompanyProfile,
  uploadCompanyImage,
};
