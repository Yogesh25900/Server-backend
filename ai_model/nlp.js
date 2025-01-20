const fs = require('fs'); // For reading the JSON file
const { NlpManager } = require('node-nlp');  // For advanced NLP tasks like intent classification
const nlp = require('compromise');  // For text parsing and named entity extraction
const natural = require('natural');  // For basic NLP tasks like tokenization
const path = require('path');

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

// Main function to handle user queries

async function handleUserQuery(userQuery) {
  console.log('User Query:', userQuery);

  // Preprocess the text
  const tokens = preprocessText(userQuery);
  console.log('Tokenized:', tokens);

  // Extract named entities
  const entities = extractEntities(userQuery);
  console.log('Extracted Entities:', entities);

  // Check if the query includes "wikipedia" and process accordingly
  if (userQuery.toLowerCase().includes('wikipedia')) {
    try {
      // Search Wikipedia
      const wikipediaResult = await searchWikipedia(userQuery);
      console.log('Wikipedia Result:', wikipediaResult);
      return wikipediaResult;
    } catch (error) {
      console.error('Error fetching Wikipedia:', error);
      return "Sorry, there was an issue searching Wikipedia.";
    }
  }

  // Check if the query includes "google" and process accordingly
 

  // If neither Wikipedia nor Google is in the query, process with NLP intent matching
  else {
    try {
      const response = await matchIntent(userQuery);
      console.log('Bot Response:', response);
      return response || "Sorry, I didn't understand that.";
    } catch (error) {
      console.error('Error processing NLP intent:', error);
      return "Sorry, there was an issue processing your query.";
    }
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
async function generateAssistantReply(userQuery) {
  if (!userQuery) {
    return "User query is required.";
  }

  // Load intents from the JSON file (only once at startup)
  loadIntents();

  // Train the model only once (ideally, you'd want this to be in a separate training routine, not every time)
  await trainModel();

  // Handle the user query and return the response
  const response = await handleUserQuery(userQuery);
  return response;
}

// Example usage
async function exampleUsage() {
  const userQuery = 'albert einstein';  // Example query
  const response = await searchWikipedia(userQuery);
  console.log('Wikipedia Search Result:', response);
}


// generateAssistantReply("time")
// exampleUsage();  // Run example usage to test the function

// Export the generateAssistantReply function for external use
module.exports = {
  generateAssistantReply,
};
