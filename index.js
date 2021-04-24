require('dotenv').config();
require("log-node")();
const TradePairUtil = require("./Utils/TradePairUtil");
const Watcher = require("./Watcher");
const Action = require("./Actions/DefaultAction");

const ccxt = require ('ccxt');
const BinanceTradePairUtil = require("./Utils/BinanceTradePairUtil");

(async function () {
    let binance    = new ccxt.binance({
        apiKey: process.env.API_KEY,
        secret: process.env.API_SECRET,
        timeout: 30000,
        enableRateLimit: true
    })

    const pairsToWatch = TradePairUtil.parsePairList(process.env.PAIRS_TO_WATCH);

    if (!(await new BinanceTradePairUtil(binance).validatePairs(pairsToWatch))) {
        throw Error("Some pairs are not available with binance, please fix this in .env and restart");
    }

    const action  = new Action();

    const watcher = new Watcher(binance, pairsToWatch, action.action)

    await watcher.watch();
}) ();
