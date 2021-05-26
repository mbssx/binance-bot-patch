require('dotenv').config();
require("log-node")();
const http = require("http")
const TradePairUtil = require("./Utils/TradePairUtil");
const Watcher = require("./Watcher");
const Action = require("./Actions/DefaultAction");

const ccxt = require ('ccxt');
const BinanceTradePairUtil = require("./Utils/BinanceTradePairUtil");

const port = process.env.PORT || 3000;

http.createServer(function(request, response) {
            response.writeHead(200);
            response.write("Entropy governs our universe, but this action you took randomly is probably redundant.");
            response.end();
}).listen(port);


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

    // const positions = await binanceFuture.fapiPrivateV2GetPositionRisk({
    //     symbol: "BNBUSDT"
    // });
    //
    // console.log(positions);
    //
    // process.exit();

    const binanceTradePairUtil = new BinanceTradePairUtil(binanceFuture)


    const pairsToWatch = TradePairUtil.parsePairList(process.env.PAIRS_TO_WATCH);

    if (!(await binanceTradePairUtil.validatePairs(pairsToWatch))) {
        throw Error("Some pairs are not available with binance, please fix this in .env and restart");
    }

    const action  = new Action(binance, binanceFuture, binanceTradePairUtil);

    const watcher = new Watcher(binance, pairsToWatch, action.action)

    await watcher.watch();
}) ();
