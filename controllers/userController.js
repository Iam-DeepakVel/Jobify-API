const User = require('../models/User')
const {StatusCodes} = require('http-status-codes')
const customErr = require('../errors')
const checkPermissions = require('../utils/checkPermissions')
const { attachCookiesToResponse } = require('../utils')
const utils = require('../utils')


const getAllUsers = async(req,res)=>{
  const users = await User.find({}).select('-password')
  res.status(StatusCodes.OK).json({users,count:users.length})
}

const getSingleUser = async(req,res)=>{
  const user = await User.findOne({_id:req.params.id}).select('-password')
  if(!user){
    throw new customErr.NotFoundError(`No user found with id ${req.params.id}`)
  }
  checkPermissions(req.user,req.params.id)
  res.status(StatusCodes.OK).json({user})
}

const updateUser = async(req,res)=>{
  const {name} = req.body
  if(!name){
    throw new customErr.BadRequestError(`Please enter your details to update`)
  }
  const user = await User.findOne({_id:req.user.userId}).select('-password')
  user.name = name
  await user.save()
  const payload = {name:user.name,userId:user._id,role:user.role}
  attachCookiesToResponse({res,user:payload})
  res.status(StatusCodes.OK).json({user})
}

const showCurrentUser = async(req,res)=>{
  const user = await User.findOne({_id:req.user.userId}).select('-password')
  if(!user){
    throw new customErr.NotFoundError(`User with id${req.user.userId} is not found!`);
  }
  res.status(StatusCodes.OK).json({user})
}

const updateUserPassword = async(req,res)=>{
  const {oldPassword,newPassword,newPasswordAgain} = req.body
  if(!oldPassword || !newPassword || !newPasswordAgain){
    throw new customErr.BadRequestError(`Please enter your password`)
  }
  const user = await User.findOne({_id:req.user.userId})

  const oldPass = await user.comparePassword(oldPassword)
  if(!oldPass){
    throw new customErr.UnauthenticatedError(`Your Old Password is Incorrect`)
  }
  if(newPassword !== newPasswordAgain){
    throw new customErr.BadRequestError(`Password doesn't match`)
  }
  user.password = newPassword;
  user.save()
  utils.passwordResetSuccessfullEmail({name:user.name,email:user.email})
  res.status(StatusCodes.OK).json({msg:'Password Updated'})
  
}

module.exports = {
  getAllUsers,
  getSingleUser,
  updateUser,
  showCurrentUser,
  updateUserPassword
}