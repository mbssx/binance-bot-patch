let log = require("log");
log = log.get('default-action');
const tg = require("../Notifications/Telegram/Telegram");
const Trade = require("../Helpers/Trade");

let that;

class DefaultAction {
    constructor() {
        this.tg = tg;
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
        // Send TG message
        // check if copy trade available
        // check if copy trade available for this specific pair
        // probably copy trade to future wallet
    }
}

module.exports = DefaultAction;
