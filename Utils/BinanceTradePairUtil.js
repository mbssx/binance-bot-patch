let log = require("log");
log = log.get('binance-trade-pair-util');

class BinanceTradePairUtil {
    constructor(cctx) {
        this.cctx = cctx;
        this.availablePairs = [];
    }

    async fetchPairs() {
        // console.log(await this.cctx.fetchMarkets());
        this.availablePairs = await this.cctx.fetchMarkets();
    }

    async getPairInfo(pair) {
        if (!await this.validatePair(pair)) {
            throw new Error(`Invalid/Unknown pair ${pair.toString()}`);
        }

        return this.availablePairs.find((aPair) => {
            return aPair.id === pair.toString();
        })
    }

    async getMinNominalForPair(pair) {
        return (await this.getPairInfo(pair)).info.filters.find((filter) => {
            return filter.filterType === "MIN_NOTIONAL";
        }).minNotional;
    }

    async validatePair(pair) {
        if (this.availablePairs.length === 0) {
            await this.fetchPairs();
        }

        return typeof this.availablePairs.find((aPair) => {
            return aPair.id === pair.toString()
        }) !== "undefined";
    }

    async validatePairs(pairs) {
        return pairs.reduce(async (carry, pair) => {
            const isPairAvailable = await this.validatePair(pair);
            if (!isPairAvailable) {
                log.error("Pair %s is not available on Binance", pair.toString('-'));
            }

            return (await carry) && isPairAvailable;
        }, true);
    }
}

module.exports = BinanceTradePairUtil;
