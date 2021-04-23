const TradesWatcher = require("./SpotWallet/TradesWatcher");

class Watcher {
    constructor(cctx, pairsToWatch, onTrade = null) {
        this.timer = 5000; // run watcher each 5 second
        this.cctx = cctx;
        this.pairsToWatch = pairsToWatch;
        this.onTrade = onTrade;

        this.watchers = [];

        for(const pair of this.pairsToWatch) {
            this.watchers.push(new TradesWatcher(this.cctx, pair));
        }
    }

    async watch() {
        console.log("Starting watcher for trade pairs, ", this.pairsToWatch.reduce((carry, pair) => {
            return carry + ', ' + pair.toString();
        }, ''));

        while (true) {
            for (const watcher of this.watchers) {
                const trades = await watcher.lookForNewTrades();

                if (trades.length && typeof this.onTrade === "function") {
                    await this.onTrade(trades);
                }
            }

            await new Promise(resolve => setTimeout(resolve, this.timer))
        }
    }
}

module.exports = Watcher;
