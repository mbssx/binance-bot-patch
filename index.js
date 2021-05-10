require('dotenv').config();
require("log-node")();
const TradePairUtil = require("./Utils/TradePairUtil");
const Watcher = require("./Watcher");
const Action = require("./Actions/DefaultAction");

const ccxt = require ('ccxt');
const BinanceTradePairUtil = require("./Utils/BinanceTradePairUtil");

(async function () {
    const binance = new ccxt.binance({
        apiKey: process.env.BINANCE_FUTURE_API_KEY,
        secret: process.env.BINANCE_FUTURE_API_SECRET,
        timeout: 30000,
        enableRateLimit: true,
    })

    const binanceFuture = new ccxt.binance({
        apiKey: process.env.BINANCE_FUTURE_API_KEY,
        secret: process.env.BINANCE_FUTURE_API_SECRET,
        timeout: 30000,
        enableRateLimit: true,
        defaultType: 'future'
    });

    const binanceTradePairUtil = new BinanceTradePairUtil(binanceFuture)


    const pairsToWatch = TradePairUtil.parsePairList(process.env.PAIRS_TO_WATCH);

    if (!(await binanceTradePairUtil.validatePairs(pairsToWatch))) {
        throw Error("Some pairs are not available with binance, please fix this in .env and restart");
    }

    const action  = new Action(binance, binanceFuture, binanceTradePairUtil);

    const watcher = new Watcher(binance, pairsToWatch, action.action)

    await watcher.watch();
}) ();
