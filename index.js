require('dotenv').config();
const TradePairUtil = require("./Utils/TradePairUtil");
const Watcher = require("./Watcher");
const Action = require("./Actions/DefaultAction");

const ccxt = require ('ccxt');

(async function () {
    let binance    = new ccxt.binance({
        apiKey: process.env.API_KEY,
        secret: process.env.API_SECRET,
        timeout: 30000,
        enableRateLimit: true
    })

    console.log(binance.id, await binance.fetchBalance());

    const pairsToWatch = TradePairUtil.parsePairList(process.env.PAIRS_TO_WATCH);

    const action  = new Action();

    const watcher = new Watcher(binance, pairsToWatch, action.action)

    await watcher.watch();
}) ();
