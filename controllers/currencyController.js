const Freecurrencyapi = require('../services/Freecurrencyapi');
// Instantiate the Freecurrencyapi class with your API key  
// Initialize the API with your API Key (get one for free at freecurrencyapi.com)
const apiKey = 'your-api-key-here';  // Replace with your actual API key
const currencyApi = new Freecurrencyapi(apiKey);


// Endpoints accessible with a free account:
// status
// currencies
// latest
// historical

const getStatus = async (req, res) => {
    try {
        const status = await currencyApi.status();
        res.json(status);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getCurrencies = async (req, res) => {
    const { params } = req.query; // Fetch query parameters if any
    try {
        const currencies = await currencyApi.currencies(params);
        res.json(currencies);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


//params as  base_currency: 'USD',
//   currencies: 'EUR'
const getLatest = async (req, res) => {
    const { params } = req.query;
    try {
        const latest = await currencyApi.latest(params);
        res.json(latest);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getHistorical = async (req, res) => {
    const { params } = req.query;
    try {
        const historical = await currencyApi.historical(params);
        res.json(historical);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { getStatus, getCurrencies, getLatest, getHistorical };
