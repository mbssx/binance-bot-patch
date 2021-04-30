let log = require("log");
log = log.get('default-action');
const tg = require("../Notifications/Telegram/Telegram");
const Trade = require("../Helpers/Trade");
const TradeExecutor = require("../FutureWallet/TradeExecutor");

let that;

class DefaultAction {
    constructor(cctx, cctxFuture) {
        this.tg = tg;
        this.cctx = cctx;
        this.cctxFuture = cctxFuture;
        this.tradeExecutor = new TradeExecutor(cctxFuture);
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
        this.tradeExecutor.replicateTrade(tradeObj).then(async (futureTrade) => {
            console.log(futureTrade);
            const futureTradeObj = new Trade(futureTrade, pair, 'Future');
            await this.tg.sendTradeMessage(futureTradeObj);
        }).catch(async (e) => {
            await this.tg.sendMessage(`
### Error replicating trade in future wallet

${e.message}
`);
        });
        // Send TG message
        // check if copy trade available
        // check if copy trade available for this specific pair
        // probably copy trade to future wallet
    }
}

module.exports = DefaultAction;
