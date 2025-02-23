const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000); // 6-digit random code
  };
  
  module.exports = generateVerificationCode;
  