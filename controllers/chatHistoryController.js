const { Query, Response } = require('../models');  // Import from index.js

const { generateAssistantReply } = require('../ai_model/nlp');

// Save User Query and Assistant Response
const saveChatHistoryController = async (req, res) => {
  const { userid, querytext } = req.body;

  if (!userid || !querytext) {
    return res.status(400).json({ error: 'User ID and query text are required' });
  }

  try {
    // Save the user's query
    const queryEntry = await Query.create({
      userid,
      querytext,
    });

    // Generate Assistant's Response
    const assistantReply = await generateAssistantReply(querytext);

    // Save response linked to the query
    const responseEntry = await Response.create({
      queryid: queryEntry.queryid,
      responsetext: assistantReply,
      responsetime: new Date(),
    });

    res.status(200).json({ query: queryEntry, response: responseEntry });
  } catch (error) {
    console.error('Error saving chat history:', error);
    res.status(500).json({ error: 'Error saving chat history' });
  }
};

// Get All Chat History with Responses
const getChatHistoryController = async (req, res) => {
  try {
    // Fetch all queries along with their associated responses
    const chatHistory = await Query.findAll({
      include: [
        {
          model: Response,  // Include the Response model
          as: 'response',   // Alias (optional but helps if you use associations)
          required: false,   // This ensures that we still get queries even without responses
        }
      ]
    });

    // Send the chat history data
    res.json(chatHistory);
  } catch (error) {
    console.error("Error fetching chat history:", error);
    res.status(500).json({ error: 'Failed to fetch chat history' });
  }
};

// Delete Chat History by Query ID (Cascade deletes response)
const deleteChatHistoryController = async (req, res) => {
  try {
    const { queryid } = req.params;

    // Find the query entry with its associated responses
    const queryEntry = await Query.findByPk(queryid);
    
    if (!queryEntry) {
      return res.status(404).json({ error: 'Chat history not found' });
    }

    // Delete associated responses first
    await Response.destroy({
      where: {
        queryid: queryEntry.queryid
      }
    });

    // Now delete the query itself
    await queryEntry.destroy();

    res.status(200).json({ message: 'Chat history and associated response(s) deleted successfully' });
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
