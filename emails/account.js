const config = require("config");
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(config.get("sendGridAPIkey"));
const sendWelcomeEmail = (email, name) => {
  sgMail
    .send({
      to: email,
      from: "mailmepeter2@gmail.com",
      subject: "Thanks For Joining in!",
      text: `Welcom to  movie rentals ${name}`,
    })
    .then(() => {
      console.log("email sent");
    })
    .catch((error) => {
      console.log(error.response.body.errors);
    });
};

module.exports = {
  sendWelcomeEmail,
};
