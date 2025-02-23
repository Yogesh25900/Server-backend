const transporter = require("../config/mailConfig");

const sendEmail = async (email, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: subject,
    text: message,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true, message: "Email sent successfully" };
  } catch (error) {
    return { success: false, message: "Failed to send email", error: error.message };
  }
};

module.exports = sendEmail;
