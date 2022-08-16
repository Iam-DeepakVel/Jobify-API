//Dotenv and async Errors
require("dotenv").config();
require("express-async-errors");

//Express
const express = require("express");
const app = express();

//Extra Packages
const morgan = require('morgan')

//File upload packages
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2

//db
const connectDB = require("./db/connect");

//To access cookies from req.signedCookies
const cookieParser = require('cookie-parser')

//Router
const authRouter = require('./routes/authRoutes')
const studentRouter = require('./routes/studentRoutes')
const userRouter = require('./routes/userRoutes')
const companyRouter = require('./routes/companyRoutes')
const jobRouter = require('./routes/jobRoutes')

//middlewares
const errorHandlerMiddleware = require('./middlewares/error-handler')
const notFoundMiddleware = require('./middlewares/not-found')

//To access req.body
app.use(express.json());

//To access req.signedCookies and get the token from Signed Cookie
app.use(cookieParser(process.env.JWT_SECRET))

//Morgan
app.use(morgan('tiny'))

//File Upload
app.use(fileUpload({useTempFiles:true}))
cloudinary.config({ 
  cloud_name: 'cloudwings', 
  api_key: process.env.CLOUD_API_KEY, 
  api_secret: process.env.CLOUD_API_SECRET 
});

//Routes
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/user',userRouter)
app.use('/api/v1/student',studentRouter)
app.use('/api/v1/company',companyRouter)
app.use('/api/v1/job',jobRouter)

//Homepage of API
app.get('/',(req,res)=>{
  res.send('Jobify')
});

//Middlewares That handles Route doesnt exist and Error
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

//To start my Beast!!!!
const start = async () => {
  try {
    const port = process.env.PORT || 1000;
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};
start();
