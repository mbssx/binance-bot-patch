class FutureTrade {
    constructor(trade, pair, wallet) {
        this.trade = trade;
        this.pair = pair;
        this.wallet = wallet;
    }

    formatTgMessage() {
        return `
## Trade In ${this.wallet} Wallet ##\n\n
Symbol: ${this.trade.symbol}
Side: ${this.trade.side}
Price: ${this.trade.price} ${this.pair.quote}/${this.pair.base}
Type: ${this.trade.type}
Quantity: ${this.trade.origQty} ${this.pair.base}
OrderId: ${this.trade.orderId}
Status: ${this.trade.status}
PositionSide: ${this.trade.positionSide}
        `;
    }

    formatConsoleMessage() {
        return `
----------
=> Trade in ${this.wallet} wallet
## ${this.trade.side.toUpperCase()} ${this.trade.origQty} ${this.pair.base} at ${this.trade.price} ${this.pair.quote}/${this.pair.base}
----------
`;
    }
}

module.exports = FutureTrade;
