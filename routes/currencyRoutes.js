const express = require('express');
const router = express.Router();
const currencyController = require('../controllers/currencyController');

// Define the routes and link them to the controller methods
router.get('/status', currencyController.getStatus);
router.get('/currencies', currencyController.getCurrencies);
router.get('/latest', currencyController.getLatest);
router.get('/historical', currencyController.getHistorical);

module.exports = router;
