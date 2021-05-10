let log = require("log");
log = log.get('default-action');
const tg = require("../Notifications/Telegram/Telegram");
const Trade = require("../Helpers/Trade");
const TradeExecutor = require("../FutureWallet/TradeExecutor");
const FutureTrade = require('../Helpers/FutureTrade');

let that;

class DefaultAction {
    constructor(cctx, cctxFuture, binanceTradePairUtil) {
        this.tg = tg;
        this.cctx = cctx;
        this.cctxFuture = cctxFuture;
        this.binanceTradePairUtil = binanceTradePairUtil;
        this.tradeExecutor = new TradeExecutor(this.cctxFuture, binanceTradePairUtil);
        that = this;
    }

    async action(trades, pair, wallet) {
        return trades.map(async trade => {
            await that.individualAction(trade, pair, wallet);
        })
    }

    async individualAction(trade, pair, wallet) {
        const tradeObj = new Trade(trade, pair, wallet);
        log.notice(tradeObj.formatConsoleMessage());
        await this.tg.sendTradeMessage(tradeObj);
        const min = parseFloat(await this.binanceTradePairUtil.getMinNominalForPair(pair));
        if (min > parseFloat(tradeObj.trade.cost)) {
            await this.tg.sendMessage(`
### Error replicating trade in future wallet - MIN_NOTIONAL

MINIMUM: ${min} ${tradeObj.pair.quote}
Last Trade: ${tradeObj.trade.cost} ${tradeObj.pair.quote}
`);
        } else {
            this.tradeExecutor.replicateTrade(tradeObj).then(async (futureTrade) => {
                const futureTradeObj = new FutureTrade(futureTrade, pair, 'Future');
                await this.tg.sendTradeMessage(futureTradeObj);
                return [tradeObj, futureTrade];
            }).then(async ([tradeObj, futureTrade]) => {
                const shortTrade = await this.tradeExecutor.createShortTrade(tradeObj);
                // await this.tg.sendTradeMessage(futureTradeObj);
                console.log(shortTrade);
            }).catch(async (e) => {
                console.log(e);
                await this.tg.sendMessage(`
### Error replicating trade in future wallet - INSUFFICIENT_BALANCE

${e.message}
`);
            });
        }
    }
}

module.exports = DefaultAction;
