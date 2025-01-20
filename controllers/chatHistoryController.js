const ChatHistory = require('../models/chatHistoryModel');
const { generateAssistantReply } = require('../ai_model/nlp'); // NLP function for generating replies

// Save chat history (user query and assistant reply)
const saveChatHistoryController = async (req, res) => {
  const { userQuery } = req.body;

  if (!userQuery) {
    return res.status(400).json({ error: 'User query is required' });
  }

  try {
    // Generate the assistant's reply
    const assistantReply = await generateAssistantReply(userQuery);

    // Save chat history to the database
    const chatEntry = await ChatHistory.create({
      user_query: userQuery,
      assistant_reply: assistantReply,
    });

    res.status(200).json({ chatEntry });
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ error: 'Error saving chat history' });
  }
};

// Get all chat history
const getChatHistoryController = async (req, res) => {
  try {
    const history = await ChatHistory.findAll({
      order: [['created_at', 'DESC']],
    });

    res.status(200).json(history);
  } catch (error) {
    console.error('Error fetching chat history:', error);
    res.status(500).json({ error: 'Error fetching chat history' });
  }
};

const deleteChatHistoryController = async (req, res) => {
  try {
    const { id } = req.params;  // Get the chat history ID from the URL parameters

    // Find the chat history entry by ID
    const chatHistory = await ChatHistory.findByPk(id);

    if (!chatHistory) {
      return res.status(404).json({ error: 'Chat history not found' });
    }

    // Delete the chat history entry from the database
    await chatHistory.destroy();

    // Send a success response
    res.status(200).json({ message: 'Chat history deleted successfully' });
  } catch (error) {
    console.error('Error deleting chat history:', error);
    res.status(500).json({ error: 'Error deleting chat history' });
  }
};


module.exports = {
  saveChatHistoryController,
  getChatHistoryController,
  deleteChatHistoryController
};
