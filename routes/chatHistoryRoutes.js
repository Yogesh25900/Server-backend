const express = require('express');
const {
  saveChatHistoryController,
  getChatHistoryController,
  deleteChatHistoryController,
} = require('../controllers/chatHistoryController');

const router = express.Router();

// Route to save chat history
router.post('/save-chat-history', saveChatHistoryController);

// Route to get all chat history
router.get('/get-chat-history', getChatHistoryController);
router.delete('/delete-chat-history/:id', deleteChatHistoryController);

module.exports = router;
