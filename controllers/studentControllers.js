const { StatusCodes } = require("http-status-codes");
const Student = require("../models/Student");
const customErr = require("../errors");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");


const createStudentProfile = async (req, res) => {
  const AlreadyStudentProfileExists = await Student.findOne({user:req.user.userId});
  if(AlreadyStudentProfileExists){
    throw new customErr.BadRequestError(`Profile Already Exists for this User`)
  }
  req.body.user = req.user.userId;
  const student = await Student.create(req.body);
  res.status(StatusCodes.CREATED).json({ student });
};

const getAllStudentProfiles = async (req, res) => {
  const students = await Student.find({});
  res.status(StatusCodes.OK).json({ students,count:students.length});
};

const getSingleStudentProfile = async (req, res) => {
  const student = await Student.findOne({_id:req.params.id})
  if(!student){
    throw new customErr.NotFoundError(`Profile with id ${req.params.id} not found`)
  }
  res.status(StatusCodes.OK).json({student})
};


const updateStudentProfile = async (req, res) => {
  //Finding current user's Student Profile
  const student = await Student.findOne({user:req.user.userId})
  if(!student){
    throw new customErr.NotFoundError(`User Not Found`)
  }
  const studentId = req.params.id;
  //Checking Permission
  //Change to String (use toString())
  if( studentId !== student._id.toString()){
    throw new customErr.UnauthorizedError(`You dont have permission to access this route`)
  }
  //Updating
  const updatedStudent = await Student.findOneAndUpdate({_id:req.params.id},req.body,{
    new:true,
    runValidators:true,
  })
  if(!updatedStudent){
    throw new customErr.NotFoundError(`User Not Found`)
  }
 
  res.status(StatusCodes.OK).json({updatedStudent})
};

const studentProfileImageUpload = async (req, res) => {
  if (!req.files) {
    throw new customErr.BadRequestError(`No Image is Uploaded`);
  }
  const profileImage = req.files.image;

  if (!profileImage.mimetype.startsWith("image")) {
    throw new customErr.BadRequestError(`Please Upload only Image`);
  }
  const maxSize = 1024 * 1024 * 5;
  if (profileImage.size > maxSize) {
    throw new customErr.BadRequestError("Please upload image smaller 5MB");
  }

  const result = await cloudinary.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "jobify-StudentProfileImages",
    }
  );
  fs.unlinkSync(req.files.image.tempFilePath);
  
  const student = await Student.findOne({ user: req.user.userId });
  student.image = result.secure_url;
  await student.save()
  return res.status(StatusCodes.OK).json({ image: { src: result.secure_url } });
};

module.exports = {
  createStudentProfile,
  getAllStudentProfiles,
  getSingleStudentProfile,
  updateStudentProfile,
  studentProfileImageUpload,
};
