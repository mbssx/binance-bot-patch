let log = require("log");
log = log.get('binance-trade-pair-util');

class BinanceTradePairUtil {
    constructor(cctx) {
        this.cctx = cctx;
        this.availablePairs = [];
    }

    async fetchPairs() {
        // console.log(await this.cctx.fetchMarkets());
        this.availablePairs = (await this.cctx.fetchMarkets()).map((pair) => {
            return pair.id;
        })
    }

    async validatePair(pair) {
        if (this.availablePairs.length === 0) {
            await this.fetchPairs();
        }

        return this.availablePairs.indexOf(pair.toString()) !== -1;
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
