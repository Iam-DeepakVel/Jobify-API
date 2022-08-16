const sendEmail = require("./sendEmail");

const passwordResetSuccessfullEmail = async ({ name, email }) => {
  const subject = `Password Changed!`;

  return sendEmail({
    to: email,
    subject,
    text: ` `,
    html: `<p><h2>${name}</h2>
   <h3>Your password has been changed successfully!</h3></p>`,
  });
};

module.exports = passwordResetSuccessfullEmail;
