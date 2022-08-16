const sendEmail = require("./sendEmail");

const sendforgotPasswordEmail = async ({ name, email, otpNumber }) => {
  const subject = `Hello ${name}, This mail is for resetting your current password`;


  return sendEmail({
    to: email,
    subject,
    text:` `,
    html: `Please enter the below OTP to Reset Your Password!
    <h2>${otpNumber}</h2>
    `,
  });
};


module.exports = sendforgotPasswordEmail ;
