require('dotenv').config();
const axios = require('axios');

class TextSummarizer {
    constructor() {
        this.apiUrl = 'https://api.apyhub.com/ai/summarize-text';
        this.apiToken = process.env.APYHUB_API_KEY; // Store API key in .env
    }

    async summarizeText(text) {
        try {
            const options = {
                method: 'POST',
                url: this.apiUrl,
                headers: {
                    'apy-token': this.apiToken,
                    'Content-Type': 'application/json'
                },
                data: { text: text }
            };

            const response = await axios.request(options);
            return response.data;
        } catch (error) {
            console.error("Summarization Error:", error.response?.data || error.message);
            return { error: "Failed to summarize text" };
        }
    }
}

module.exports = TextSummarizer;
