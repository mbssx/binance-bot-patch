let that;

class TradeExecutor {
    constructor(cctxFuture) {
        this.cctx = cctxFuture;
        that = this;
    }

    async getPrecisionInFuture(pair) {
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

    async updateLeverage(leverage, pair) {
        await that.cctx.fapiPrivatePostLeverage({
            symbol: pair.toString(),
            leverage: leverage,
            timestamp: new Date().getTime()
        });
    }

    async replicateTrade(tradeObj) {
        const precision = await that.getPrecisionInFuture(tradeObj.pair);

        await that.updateLeverage(process.env.FUTURE_WALLET_LEVERAGE || 20, tradeObj.pair);

        return that.cctx.fapiPrivatePostOrder({
            symbol: tradeObj.pair.toString(),
            side: tradeObj.trade.side.toUpperCase(),
            type: 'MARKET',
            quantity: parseFloat(tradeObj.trade.amount*(process.env.MULTIPLIER_IN_FUTURE_TRADES)).toFixed(precision.quantityPrecision),
            timestamp: new Date().getTime()
        });
    }

    async changePositionSideToBoth() {
        try {
            await that.cctx.fapiPrivatePostPositionSideDual({
                dualSidePosition: false,
                timestamp: new Date().getTime()
            });
        } catch (e) {
            console.log(e.message);
        }
    }

    async closeCurrentOpenPosition(tradeObj) {
        const positions = await that.cctx.fapiPrivateV2GetPositionRisk({
            symbol: tradeObj.pair.toString()
        });

        const bothTypePositions = positions.filter(position => position['positionSide'] === "BOTH");

        if (!bothTypePositions.length) return tradeObj;

        const bothTypePosition = bothTypePositions[0];

        if(
            (parseFloat(bothTypePosition['positionAmt']) > 0 && tradeObj.trade.side.toUpperCase() === "SELL")
            || (parseFloat(bothTypePosition['positionAmt']) < 0 && tradeObj.trade.side.toUpperCase() === "BUY")
        ) {

            await that.changePositionSideToBoth();

            await that.updateLeverage(bothTypePosition['leverage'], tradeObj.pair);

            await that.cctx.fapiPrivatePostOrder({
                symbol: tradeObj.pair.toString(),
                side: tradeObj.trade.side.toUpperCase(),
                type: 'MARKET',
                // positionSide: 'SHORT',
                quantity: parseFloat(bothTypePosition['positionAmt']) < 0 ? parseFloat(bothTypePosition['positionAmt']) * -1 : bothTypePosition['positionAmt'],
                timestamp: new Date().getTime()
            });
        }

        return tradeObj

    }
}

module.exports = TradeExecutor;
