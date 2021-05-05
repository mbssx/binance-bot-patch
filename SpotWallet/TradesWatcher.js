class TradesWatcher {
    constructor(cctx, pair) {
        this.cctx = cctx;
        this.pair = pair;
        this.since = new Date().getTime();
    }

    async lookForNewTrades() {
        const trades = await this.cctx.fetchMyTrades(this.pair.toString('/'), this.since);
        this.since = new Date().getTime() + 1000;
        return trades;
    }
}

module.exports = TradesWatcher;
