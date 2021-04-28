const tg = require("../Notifications/Telegram/Telegram");

let that;

class DefaultAction {
    constructor() {
        this.tg = tg;
        that = this;
    }

    async action(trades) {
        return trades.map(async trade => {
            await that.individualAction(trade);
        })
    }

    async individualAction(trade) {
        await this.tg.sendTradeMessage(trade);
        // Send TG message
        // check if copy trade available
        // check if copy trade available for this specific pair
        // probably copy trade to future wallet
    }
}

module.exports = DefaultAction;
