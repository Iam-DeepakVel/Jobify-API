const {
  createJWT,isTokenValid,attachCookiesToResponse
} = require('./jsonwebtoken')

const sendEmail = require('./sendEmail')

const sendVerificationEmail = require('./sendVerificationEmail')

const sendforgotPasswordEmail = require('./sendForgotPasswordEmail')

const passwordResetSuccessfullEmail = require('./passwordResetSuccessfullEmail')
const sendRegistrationSuccessfullEmail = require('./sendRegistrationSuccessfullEmail')
module.exports = {
  createJWT,isTokenValid,attachCookiesToResponse,sendEmail,sendVerificationEmail,sendRegistrationSuccessfullEmail,sendforgotPasswordEmail,passwordResetSuccessfullEmail
}