const { TelegramClient } = require('messaging-api-telegram');

class Telegram {
    constructor() {
        this.client = new TelegramClient({
            accessToken: process.env.TG_BOT_TOKEN,
        });
    }

    async sendTradeMessage(tradeObj) {
        await this.client.sendMessage(process.env.TG_GROUP_ID, tradeObj.formatTgMessage());
    }
}

module.exports = new Telegram;
