const jwt = require('jsonwebtoken')

const createJWT = ({payload})=>{
  return jwt.sign(payload,process.env.JWT_SECRET)
}

const isTokenValid = (token)=> jwt.verify(token,process.env.JWT_SECRET)


const attachCookiesToResponse = async({res,user})=>{
  const accessToken =  createJWT({payload:user});
   res.cookie('accessToken',accessToken,{
    httpOnly:true,
    maxAge:1000*60*60*24*3,
    secure:process.env.NODE_ENV === 'production',
    signed:true
  })
}

module.exports = {
  createJWT,isTokenValid,attachCookiesToResponse
}