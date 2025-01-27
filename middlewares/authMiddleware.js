const jwt = require('jsonwebtoken');


const verifyToken  = async (req, res, next) => {
  const token = req.cookies?.authToken; // Get token from cookies


  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Payload:", decoded); // Check the type of `id`
    req.user = decoded; // Attach the decoded payload to the request
    res.status(200).json({ message:"TOken successfully verified" });
    next();

    return user; // Return
  } catch (err) {
    // Check if the error is due to token expiration
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: "Session expired. Please log in again." });
    }

    // Handle other JWT errors (e.g., invalid token)
  }
};

module.exports = { verifyToken };


