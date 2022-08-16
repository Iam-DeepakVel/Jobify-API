const mongoose = require('mongoose')

const jobSchema = new mongoose.Schema({
   companyName:{
    type:String,
    required:true
   },
   vacantPosition:{
    type:String,
    required:true
   },
   qualificationNeeded:{
    type:String,
    required:true
   },
   experience:{
    type:String,
    required:true
   },
   packageRange:{
    type:String,
    required:true
   },
   company:{
    type:mongoose.Types.ObjectId,
    ref:'Company',
    required:true
   }
},{timestamps:true})

module.exports = mongoose.model('Job',jobSchema)