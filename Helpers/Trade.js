class Trade {
    constructor(trade, pair, wallet) {
        this.trade = trade;
        this.pair = pair;
        this.wallet = wallet;
    }

    formatTgMessage() {
        return `
## Trade In ${this.wallet} Wallet ##\n\n
Symbol: ${this.trade.info.symbol}
Side: ${this.trade.side}
Price: ${this.trade.price} ${this.pair.quote}/${this.pair.base}
Amount: ${this.trade.amount} ${this.pair.base}
Cost: ${this.trade.cost} ${this.pair.quote}
DateTime: ${this.trade.datetime}
Status: ${this.trade.status}
        `;
    }

    formatConsoleMessage() {
        return `
----------
=> Trade in ${this.wallet} wallet
## ${this.trade.side.toUpperCase()} ${this.trade.amount} ${this.pair.base} at ${this.trade.price} ${this.pair.quote}/${this.pair.base} for ${this.trade.cost} ${this.pair.quote}
----------
`;
    }
}

module.exports = Trade;
