const sendEmail = require("../services/emailService");
const generateCode = require("../utils/generateCode");
const verificationCodes = new Map();  
console.log(verificationCodes)

const sendVerificationEmail = async (req, res) => {
  const { email } = req.body;
  const code = generateCode();
  verificationCodes.set(email, { code:String(code), expiresAt: Date.now() + 10 * 60 * 1000 }); //expires in 10 minutes

  console.log("Verification code saved",verificationCodes);

  const emailResponse = await sendEmail(
    email,
    "Email Verification Code",
    `Your verification code is: ${code}`
  );

  if (emailResponse.success) {
    res.status(200).json({ message: "Verification email sent!", code });
  } else {
    res.status(500).json({ error: emailResponse.message });
  }
};

const sendForgotPasswordEmail = async (req, res) => {
  const { email } = req.body;
  const resetCode = generateCode();
  verificationCodes.set(email, { code: String(resetCode), expiresAt: Date.now() + 10 * 60 * 1000 }); // expires in 10 minutes

  const emailResponse = await sendEmail(
    email,
    "Password Reset Code",
    `Your password reset code is: ${resetCode}`
  );

  if (emailResponse.success) {
    res.status(200).json({ message: "Password reset email sent!", resetCode });
  } else {
    res.status(500).json({ error: emailResponse.message });
  }
};


const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  console.log("code from verify",verificationCodes)
  if (!verificationCodes.has(email)) {
    return res.status(400).json({ error: "Invalid or expired code" });
  }

  const storedCodeData = verificationCodes.get(email);

  // Check if the code is expired
  if (storedCodeData.expiresAt < Date.now()) {
    verificationCodes.delete(email); // Remove expired code
    return res.status(400).json({ error: "Code expired" });
  }

  // Check if the code is correct
  if (Number(storedCodeData.code) !== Number(code)) {
    return res.status(400).json({ error: "Incorrect code" });
  }
  

  // Verification successful
  verificationCodes.delete(email); // Remove code after successful verification
  res.status(200).json({ message: "Email verified successfully!" });
};

module.exports = { sendVerificationEmail, sendForgotPasswordEmail,verifyCode };
