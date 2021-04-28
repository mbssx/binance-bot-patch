const { TelegramClient } = require('messaging-api-telegram');

class Telegram {
    constructor() {
        this.client = new TelegramClient({
            accessToken: process.env.TG_BOT_TOKEN,
        });
    }

    async sendTradeMessage(trade, wallet = 'spot') {
        await this.client.sendMessage(process.env.TG_GROUP_ID, `
## Trade In ${wallet} Wallet ##\n\n
Symbol: ${trade.info.symbol}
Side: ${trade.side}
Price: ${trade.price}
Amount: ${trade.amount}
Cost: ${trade.cost}
DateTime: ${trade.datetime}
        `);
    }
}

module.exports = new Telegram;
