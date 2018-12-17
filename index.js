const token = require('./environment/prod');
const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(token, {polling: true});

bot.onText(/start/, function (msg, match) {
    const fromId = msg.from.id;
    try {
        bot.sendMessage(fromId, `Command list:
         /echo
         /masha
         `);
    } catch (e) {
        console.log('e', e)
    }
});

bot.onText(/echo (.+)/, function (msg, match) {
    const resp = match;
    const fromId = msg.from.id;
    try {
        bot.sendMessage(fromId, 'echo');
    } catch (e) {
        console.log('e', e)
    }
});

bot.onText(/masha (.+)/, function (msg, match) {
    const resp = match;
    const fromId = msg.from.id;
    try {
        bot.sendMessage(fromId, 'masha');
    } catch (e) {
        console.log('e', e)
    }
});


bot.on('message', function (msg) {
    const chatId = msg.chat.id;
    const fromId = msg.from.id;
    const text = msg['text']
    console.log(text)
    try {
        bot.sendMessage(fromId, `Message ${text}`);

    } catch (e) {
        console.log('e', e)
    }
});