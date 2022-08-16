const sendEmail = require("./sendEmail");

const sendRegistrationSuccessfullEmail = async ({ name, email }) => {
  const subject = `Your Registration is successfull!
  👋Welcome to Jobify,${name}`;

  return sendEmail({
    to: email,
    subject,
    text: ` `,
    html: `<p><h2>${name}</h2>
   <h3>we're happy to have you with us at Jobify! Start finding your desired job.</h3></p>`,
  });
};

module.exports = sendRegistrationSuccessfullEmail;
