const express = require('express');

const router = express.Router();
const {
  saveChatHistoryController,
  getChatHistoryController,
  deleteChatHistoryController,
} = require('../controllers/chatHistoryController');

router.post('/save-chat', saveChatHistoryController);
router.post('/get-chat', getChatHistoryController);
router.delete('/chat/:queryid', deleteChatHistoryController);


module.exports = router;
