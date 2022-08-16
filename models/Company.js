const mongoose = require('mongoose')
const validator = require('validator')

const companySchema = new mongoose.Schema({
  companyName:{
    type:String,
    required:true
  },
  address:{
    type:String,
    required:true
  },
  image:{
  type:String,
  default:"https://res.cloudinary.com/cloudwings/image/upload/v1660139156/jobify-StudentProfileImages/defaultStudentProfileImage_gdprst.png"
  },
  sector:{
    type:String,
    required:true
  },
  achievements:{
    type:String,
  },
  headOffice:{
    type:String
  },
  branches:{
    type:String
  },
  email:{
    type:String,
    validator:{
      validate:validator.isEmail,
      msg:'Please enter valid email'
    },
    required:true
  },
  phoneNumber:{
    type:Number,
  },
  user:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true
  }
},{timestamps:true})


module.exports = mongoose.model('Company',companySchema)