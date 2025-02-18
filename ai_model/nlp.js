const fs = require('fs'); // For reading the JSON file
const { NlpManager } = require('node-nlp');  // For advanced NLP tasks like intent classification
const nlp = require('compromise');  // For text parsing and named entity extraction
const natural = require('natural');  // For basic NLP tasks like tokenization
const path = require('path');
const taskController = require('../controllers/taskController');  // Import the task controller
const Task = require('../models/taskModel');

const wiki = require('wikijs').default;  // Import the wikijs library


// Initialize the NLP Manager for node-nlp
const manager = new NlpManager({ languages: ['en'] });

// Construct the relative path to intents.json using __dirname
const intentsPath = path.join(__dirname, 'intents.json');

// Declare `intents` using `let` so it can be reassigned
let intents;

try {
  // Read and parse the JSON file
  intents = JSON.parse(fs.readFileSync(intentsPath, 'utf8'));
} catch (error) {
  console.error("Error reading intents.json:", error);
  process.exit(1);  // Exit the process if the file read fails
}


// Function to write JSON file
function writeData(data) {
  try {
      fs.writeFileSync("ai_model/data.json", JSON.stringify(data, null, 2), "utf8");
  } catch (error) {
      console.error("Error writing to data.json:", error);
  }
}

function readData() {
  try {
      const data = fs.readFileSync("ai_model/data.json", "utf8");
      return JSON.parse(data);
  } catch (error) {
      console.error("Error reading data.json:", error);
      return { conversationState: {}, taskDetails: {} };
  }
}
// Load intents and responses into the NLP manager
function loadIntents() {
  for (let intent in intents) {
    const { examples, responses } = intents[intent];

    // Add examples to the NLP model
    examples.forEach(example => {
      manager.addDocument('en', example, intent);
    });

    // Add responses to the NLP model
    manager.addAnswer('en', intent, responses);
  }
}

// Train the model once and only once
async function trainModel() {
  await manager.train();
  console.log('NLP model trained.');
}

// Preprocess and tokenize user input using natural
function preprocessText(text) {
  const tokenizer = new natural.WordTokenizer();
  return tokenizer.tokenize(text);
}

// Extract named entities using compromise
function extractEntities(text) {
  const doc = nlp(text);
  return doc.topics().out('array');
}

// Function to replace dynamic placeholders (like date and time)
function replaceDynamicPlaceholders(response) {
  const now = new Date();
  const time = now.toLocaleTimeString();
  const date = now.toLocaleDateString();

  if (!response) {
    return ""; // If response is undefined or null
  }

  if (Array.isArray(response)) {
    return response.map(item => item.replace('{{date}}', date).replace('{{time}}', time));
  }

  return response.replace('{{date}}', date).replace('{{time}}', time);
}


// Match the intent using node-nlp
async function matchIntent(text) {
  const response = await manager.process('en', text);

  let finalResponse = response.answer;

  if (Array.isArray(finalResponse)) {
    finalResponse = finalResponse[Math.floor(Math.random() * finalResponse.length)];
  }

  finalResponse = replaceDynamicPlaceholders(finalResponse);

  return finalResponse || "Sorry, I didn't understand that.";
}


async function handleTaskQueries(userID, userQuery) {
  let data = readData();  // Load existing data
  let conversationState = data.conversationState[userID] || "idle";
  let taskDetails = data.taskDetails[userID] || {};

  if (userQuery.toLowerCase().includes("add task") && conversationState === 'idle') {
      conversationState = 'creating_task_name';
      data.conversationState[userID] = conversationState;
      writeData(data);
      return "Got it! What should we call this task?";
  }

  if (conversationState === 'creating_task_name') {
      taskDetails.taskName = userQuery;
      conversationState = 'creating_task_description';
      data.conversationState[userID] = conversationState;
      data.taskDetails[userID] = taskDetails;
      writeData(data);
      return "Great! Could you please describe the task in detail?";
  }

  if (conversationState === 'creating_task_description') {
      taskDetails.taskDescription = userQuery;
      conversationState = 'creating_task_due_date';
      data.conversationState[userID] = conversationState;
      data.taskDetails[userID] = taskDetails;
      writeData(data);
      return "Noted! When is the due date for this task?";
  }

  if (conversationState === 'creating_task_due_date') {
      taskDetails.dueDate = userQuery;
      conversationState = 'confirming_task';
      data.conversationState[userID] = conversationState;
      data.taskDetails[userID] = taskDetails;
      writeData(data);
      return `Here's what I have:\n📌 Task: ${taskDetails.taskName}\n📝 Description: ${taskDetails.taskDescription}\n📅 Due Date: ${taskDetails.dueDate}\n\nIs this correct? (Yes/No)`;
  }

  if (conversationState === 'confirming_task') {
      if (userQuery.toLowerCase() === 'yes') {
          data.conversationState[userID] = 'idle';
          writeData(data);
          const taskDetails = data.taskDetails[userID];
          console.log(taskDetails.taskName); 
          const status = "Pending";
          const currentDate = new Date();
    const defaultDueDate = new Date(currentDate.setDate(currentDate.getDate() + 1)).toISOString().split('T')[0];  // Format to 'YYYY-MM-DD'

    // Use the provided dueDate if available, otherwise, use the default one

          const response = await taskController.createTaskforApi(userID,taskDetails.taskName,taskDetails.taskDescription,status,defaultDueDate
          )
          console.log(response)

             delete data.taskDetails[userID];  // Remove task after saving

          return "✅ Task added successfully!";
      } else if (userQuery.toLowerCase() === 'no') {
          data.conversationState[userID] = 'idle';
          delete data.taskDetails[userID];
          writeData(data);
          return "Task addition canceled. Let me know if you want to add something else!";
      } else {
          return "Please reply with 'Yes' to confirm or 'No' to cancel.";
      }
  }

  return "I didn’t understand that. Please continue where we left off.";
}


let waitingForSummary = false;  // Track whether we're waiting for the summary text

async function handleUserQuery(userID, userQuery) {
  console.log('User Query:', userQuery);

  // Preprocess the text
  const tokens = preprocessText(userQuery);
  console.log('Tokenized:', tokens);

  // Extract named entities
  const entities = extractEntities(userQuery);
  console.log('Extracted Entities:', entities);
  // console.log('Conversation State:', conversationState);

  let data = readData();  
  let conversationState = data.conversationState[userID] || "idle";

  const validStates = ['confirming_task', 'creating_task_name', 'creating_task_description', 'creating_task_due_date'];

  // Initialize the user state if not already done
  if (validStates.includes(conversationState) || userQuery.toLowerCase().includes("add task")) {
    const taskResponse = await handleTaskQueries(userID, userQuery);

    let data = readData();  
    let newconversationState = data.conversationState[userID] || "idle";
  
    console.log('Conversation State:', newconversationState);
    console.log('Task Response:', taskResponse);
    if (taskResponse){
       return taskResponse;
      }
  }


  if (waitingForSummary) {
    const summary = await summarizeText(userQuery);  // Call the summarization function
    console.log('Summarized Text:', summary);
    waitingForSummary = false;  // Reset the waiting state
    return summary;  // Return the summary to the user
  }

  // Check if the query includes "summarize" or "summary"
  if (userQuery.toLowerCase().includes('summarize') || userQuery.toLowerCase().includes('summary')) {
    // Set the state to waiting for the content to summarize
    waitingForSummary = true;
    return "Please provide the text you want to summarize.";  // Ask the user for the text
  }
  // Check if the query includes "wikipedia"
  if (userQuery.toLowerCase().includes('wikipedia')) {
    try {
      const wikipediaResult = await searchWikipedia(userQuery);
      console.log('Wikipedia Result:', wikipediaResult);
      return wikipediaResult;
    } catch (error) {
      console.error('Error fetching Wikipedia:', error);
      return "Sorry, there was an issue searching Wikipedia.";
    }
  }

  // Process NLP intent matching if not in task creation mode
  else{
    const response = await matchIntent(userQuery);
    console.log('Bot Response:', response);
    return response || "Sorry, I didn't understand that.";
  } 
}




async function searchWikipedia(query) {
  try {
    // Perform the search for the given query
    const searchResults = await wiki().search(query, 1);  // Search for the query in Wikipedia (limit to 1 result)
    
    if (searchResults.results.length > 0) {
      // Get the first result and fetch its summary
      const page = await wiki().page(searchResults.results[0]);
      const summary = await page.summary();  // Correctly call the summary method on the page object
      
      // Check if the summary is empty and return a fallback message
      if (summary) {
        return summary;
      } else {
        return "No detailed summary found on Wikipedia.";
      }
    } else {
      return "No relevant information found on Wikipedia.";
    }
  } catch (error) {
    console.error("Error searching Wikipedia:", error);
    return "Error occurred while fetching data from Wikipedia.";
  }
}

// Function to generate assistant reply
async function generateAssistantReply(userID,userQuery) {
  if (!userQuery) {
    return "User query is required.";
  }

  // Load intents from the JSON file (only once at startup)
  loadIntents();

  // Train the model only once (ideally, you'd want this to be in a separate training routine, not every time)
  await trainModel();

  // Handle the user query and return the response
  const response = await handleUserQuery(userID,userQuery);
  return response;
}

// Example usage
// async function exampleUsage() {
//   const userQuery = 'albert einstein';  // Example query
//   const response = await searchWikipedia(userQuery);
//   console.log('Wikipedia Search Result:', response);
// }


// generateAssistantReply(19,"give me a joke");
// exampleUsage();  // Run example usage to test the function

// Export the generateAssistantReply function for external use

const TextSummarizer = require('../services/TextSummarizer ');

async function summarizeText(userQuery) {
  const summarizer = new TextSummarizer();  // Create an instance of the TextSummarizer service
  const result = await summarizer.summarizeText(userQuery);
  return result.data.summary;  // Return the summary
}


module.exports = {
  generateAssistantReply,
};