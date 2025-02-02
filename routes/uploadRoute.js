const express = require('express');
const upload = require('../middlewares/imageUpload'); // Import the middleware

const router = express.Router();

// File upload route
router.post('/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }
    const filePath = `/uploads/${req.file.filename}`;
    const fullPath = `${req.protocol}://${req.get('host')}${filePath}`;
    res.json({
      message: "Image uploaded successfully!",
      filePath: fullPath,  // Full URL sent to the client
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
