const { TelegramClient } = require('messaging-api-telegram');

class Telegram {
    constructor() {
        this.client = new TelegramClient({
            accessToken: process.env.TG_BOT_TOKEN,
        });
    }

    async sendTradeMessage(trade) {
        await this.client.sendMessage(process.env.TG_GROUP_ID, "I Don't know what to send right now without trade lol!!!");
    }
}

module.exports = new Telegram;
