require('dotenv').config();
const ccxt = require ('ccxt');

(async function () {
    let binance    = new ccxt.binance({
        apiKey: process.env.API_KEY,
        secret: process.env.API_SECRET,
        timeout: 30000,
        enableRateLimit: true
    })

    console.log(binance.id, await binance.fetchBalance());
}) ();
