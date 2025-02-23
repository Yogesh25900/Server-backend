const { Query, Response } = require('../models');  // Import from index.js

const { generateAssistantReply } = require('../ai_model/nlp');

// Save User Query and Assistant Response
const saveChatHistoryController = async (req, res) => {
  const { userID, querytext } = req.body;

  if (!userID || !querytext) {
    return res.status(400).json({ error: 'User ID and query text are required' });
  }

  try {
    // Save the user's query
    const queryEntry = await Query.create({
      userID,
      querytext,
    });

    // Generate Assistant's Response
    const assistantReply = await generateAssistantReply(userID,querytext);

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
    const { userID } = req.body;

    const chatHistory = await Query.findAll({
      where: { userID },
      include: [
        {
          model: Response,
          as: 'response',
          required: false,
        }
      ],
    });

    // Transform the response to { query: {}, response: {} }
    const formattedChatHistory = chatHistory.map(chat => ({
      query: {
        queryid: chat.queryid,
        userID: chat.userID,
        querytext: chat.querytext,
        createdAt: chat.createdAt,
        updatedAt: chat.updatedAt
      },
      response: chat.response ? { 
        responseid: chat.response.responseid,
        queryid: chat.response.queryid,
        responsetext: chat.response.responsetext,
        responsetime: chat.response.responsetime,
        createdAt: chat.response.createdAt,
        updatedAt: chat.response.updatedAt
      } : null
    }));

    res.json(formattedChatHistory);
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
