let that;

class TradeExecutor {
    constructor(cctxFuture) {
        this.cctx = cctxFuture;
        that = this;
    }

    replicateTrade(tradeObj) {
        return that.cctx.createLimitOrder(tradeObj.pair.toString('/'), tradeObj.trade.side, tradeObj.trade.amount, tradeObj.trade.price);
    }
}

module.exports = TradeExecutor;
