let log = require("log");
log = log.get('watcher');
const TradesWatcher = require("./SpotWallet/TradesWatcher");
const loader = require('./Utils/ConsoleLoader');

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
        this.pairsToWatch.map( pair => {
            log.notice("Starting watcher for trade pair %s ", pair.toString('-'));
        });

        loader.start();

        while (true) {
            for (const watcher of this.watchers) {
                const trades = await watcher.lookForNewTrades();

                if (trades.length && typeof this.onTrade === "function") {
                    await this.onTrade(trades, watcher.pair, 'Spot');
                }
            }

            await new Promise(resolve => setTimeout(resolve, this.timer))
        }
    }
}

module.exports = Watcher;
