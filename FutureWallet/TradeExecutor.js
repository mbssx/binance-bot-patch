let that;

class TradeExecutor {
    constructor(cctxFuture) {
        this.cctx = cctxFuture;
        that = this;
    }

    async getPrecision(pair) {
        const data = await that.cctx.fapiPublicGetExchangeInfo();
        const info = data.symbols.filter((symbol) => symbol.symbol === pair.toString());

        if (info.length) {
            return {
                quantityPrecision: info[0].quantityPrecision,
                baseAssetPrecision: info[0].baseAssetPrecision,
                pricePrecision: info[0].pricePrecision,
                quotePrecision: info[0].quotePrecision
            }
        } else {
            throw new Error("Pair is not in future markets");
        }
    }

    async replicateTrade(tradeObj) {
        const precision = await that.getPrecision(tradeObj.pair);
        return that.cctx.fapiPrivatePostOrder({
            symbol: tradeObj.pair.toString(),
            side: tradeObj.trade.side.toUpperCase(),
            type: 'MARKET',
            quantity: parseFloat(tradeObj.trade.amount*(process.env.MULTIPLIER_IN_FUTURE_TRADES)).toFixed(precision.quantityPrecision),
            timestamp: new Date().getTime()
        });
    }
}

module.exports = TradeExecutor;
