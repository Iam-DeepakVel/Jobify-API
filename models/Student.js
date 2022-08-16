const mongoose = require('mongoose')
const validator = require('validator')

const studentSchema = new mongoose.Schema({
  firstName:{
    type:String,
    required:true,
  },
  lastName:{
    type:String,
    required:true,
  },
  image:{
     type:String,
     default:"https://res.cloudinary.com/cloudwings/image/upload/v1660139156/jobify-StudentProfileImages/defaultStudentProfileImage_gdprst.png"
  },
  age:{
    type:Number,
    required:true
  },
  dob:{
    type:Date,
    trim:true
  },
  qualification:{
    type:String,
  },
  skills:{
    type:String
  },
  bio:{
    type:String,
    max:[2000,'Bio can contain only 2000 characters and below']
  },
  about:{
    type:String,
    max:[5000,'about can contain only 5000 characters and below']
  },
  phoneNumber:{
    type:Number,
  },
  mail:{
    type:String,
    validate:{
      validator:validator.isEmail,
      msg:'Please Enter valid Email'
    }
  },
  region:{
    type:String,
    required:true,
  },
  city:{
    type:String,
    required:true
  },
  user:{
    type:mongoose.Types.ObjectId,
    ref:'User',
    required:true,
    unique:true
  }
},{timestamps:true})



module.exports = mongoose.model('Student',studentSchema)