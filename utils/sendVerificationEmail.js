const sendEmail = require("./sendEmail");

const sendVerificationEmail = async ({ name, email, otpNumber }) => {
  const subject = `Hi ${name}, Verification Email from Jobify`;


  return sendEmail({
    to: email,
    subject,
    text:` `,
    html: `Please confirm your account by entering the otp given below!
    <h2>${otpNumber}</h2>
    `,
  });
};

module.exports = sendVerificationEmail;
