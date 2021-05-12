require('dotenv').config();
require("log-node")();
let log = require("log");
log = log.get('trade-bnb-usdt');
const Pair = require("../Helpers/Pair");

const ccxt = require ('ccxt');

class UpdateLeverage {
    constructor() {
        this.exchange = new ccxt.binance({
            apiKey: process.env.BINANCE_FUTURE_API_KEY,
            secret: process.env.BINANCE_FUTURE_API_SECRET,
            timeout: 30000,
            enableRateLimit: true,
            defaultType: 'future'
        });

        this.pair = new Pair('BNB', 'USDT');
    }

    async updateLeverage(leverage = 1) {
        return await this.exchange.fapiPrivatePostLeverage({
            symbol: this.pair.toString(),
            leverage: leverage,
            timestamp: new Date().getTime()
        });
    }

}

(async function () {
    const test = new UpdateLeverage();
    console.log(await test.updateLeverage());
})();
