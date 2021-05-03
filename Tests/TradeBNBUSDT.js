require('dotenv').config();
require("log-node")();
let log = require("log");
log = log.get('trade-bnb-usdt');
const Pair = require("../Helpers/Pair");

const ccxt = require ('ccxt');

class TradeBNBUSDT {
    constructor() {
        this.exchange = new ccxt.binance({
            apiKey: process.env.BINANCE_FUTURE_API_KEY,
            secret: process.env.BINANCE_FUTURE_API_SECRET,
            timeout: 30000,
            enableRateLimit: true
        });

        this.pair = new Pair('BNB', 'USDT');

        this.params = {
            'test': false
        }
    }

    async getUSDTFromBNB() {
        await this.exchange.createMarketOrder(this.pair.toString('/'), 'sell', (await this.getBalance(this.pair.base)), 500, this.params);
    }

    async getBNBFromUSDT() {
        // this.exchange.
        await this.exchange.createMarketOrder(this.pair.toString('/'), 'buy', 0.015, 1000, this.params);
    }

    async getBalance(currency) {
        const balances = await this.exchange.fetchBalance();

        // console.log(balances);

        // console.log(balances.info.balances.find((row) => row.asset === currency));

        return balances.free[currency];
    }

    async printBalances() {
        log.notice(`\n\nBalances\n%s : %s\n%s: %s\n`, this.pair.base, await this.getBalance(this.pair.base), this.pair.quote, await this.getBalance(this.pair.quote));
    }

    async trade() {
        await this.printBalances();
        await this.getBNBFromUSDT();
        await this.printBalances();
        await this.getUSDTFromBNB();
        await this.printBalances();
    }
}

(async function () {
    const test = new TradeBNBUSDT();
    await test.trade();
})();
