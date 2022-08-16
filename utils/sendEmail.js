const sgMail = require("@sendgrid/mail");

const sendEmail = async ({ to, subject, text, html }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to, // Change to your recipient
    from: "jobifywithyou@gmail.com", // Change to your verified sender
    subject,
    text,
    html,
  };
  await sgMail.send(msg);
};


module.exports = sendEmail;
