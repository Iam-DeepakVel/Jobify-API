const customErr = require("../errors");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.signedCookies.accessToken;
  if (!token) {
    throw new customErr.UnauthenticatedError(`Authentication Invalid`);
  }
  try {
    const payload = await isTokenValid(token);
    req.user = { userId: payload.userId, name: payload.name,role:payload.role };
    next();
  } catch (error) {
    throw new customErr.UnauthenticatedError(`Authentication Invalid`);
  }
};


const authorizePermissions = (...roles)=>{
  return (req,res,next)=>{
   if(!roles.includes(req.user.role)){
     throw new customErr.UnauthorizedError('You dont have permission to access this route')
   }
   next()
  }
}

module.exports = {authenticateUser, authorizePermissions};
