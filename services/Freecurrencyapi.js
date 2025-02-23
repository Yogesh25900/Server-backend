'use strict';

const axios = require('axios');

class Freecurrencyapi {
    baseUrl = 'https://api.freecurrencyapi.com/v1/';

    constructor(apiKey = '') {
        this.apiKey = apiKey;
    }

    async call(endpoint, params = {}) {
        const paramString = new URLSearchParams(params).toString();

        try {
            const response = await axios.get(`${this.baseUrl}${endpoint}?${paramString}`, {
                headers: {
                    apikey: this.apiKey
                }
            });
            return response.data;
        } catch (error) {
            throw new Error(`Error fetching data from FreecurrencyAPI: ${error.message}`);
        }
    }

    async status() {
        return this.call('status');
    }

    async currencies(params) {
        return this.call('currencies', params);
    }

    async latest(params) {
        return this.call('latest', params);
    }

    async historical(params) {
        return this.call('historical', params);
    }
}

module.exports = Freecurrencyapi;
