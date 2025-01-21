const jwt = require('jsonwebtoken');

const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Extract the token

  if (!token) {
    return res.status(401).json({ message: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Decoded Payload:", decoded); // Check the type of `id`
    req.user = decoded; // Attach the decoded payload to the request
    next();
  } catch (err) {
    res.status(401).json({ message: "Token is not valid" });
  }
};


module.exports = { protect };
