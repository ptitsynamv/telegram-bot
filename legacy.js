const TelegramBot = require('node-telegram-bot-api');
const bot = new TelegramBot(keys.token, {polling: true});
const helpFunctions = require('./utils/helpFunctions');
const setCommands = helpFunctions.initSet();
bot.onText(/start/, function (msg, match) {
    const fromId = msg.from.id;
    const username = msg.from.username;
    let message = '';

    new Promise((resolve, reject) => {
        resolve(User.find({chatId: fromId}))
    })
        .then((user) => {
            if (user.length === 0) {
                return new Promise((resolve, reject) => {
                    resolve(new User({
                        chatId: fromId,
                        username: username,
                    }).save());
                })
            }
            return false
        })
        .then(
            isNewUser => {
                if (isNewUser) {
                    message += `Вы зарегистрировались в системе.
                    Доступные команды:
                    /enterWaterServicePrices - ввести цены для водоснабжения.`
                }
                else {
                    return new Promise((resolve, reject) => {
                        resolve(Price.find({serviceName: 'WaterService', chatId: fromId}))
                    })
                        .then(price => {
                            if (price.length === 0) {
                                message += `Доступные команды:
                                /enterWaterServicePrices - ввести цены для водоснабжения.`
                            }
                        })
                }
            }
        )
        .then(
            data => {
                console.log('data', data);
                bot.sendMessage(fromId, message)
            })
});

bot.onText(/enterWaterServicePrices/, function (msg, match) {
    const resp = match;
    const fromId = msg.from.id;
    try {
        bot.sendMessage(fromId, `Введите цены для холодной воды, гарячей воды и канализации.
        Например:
        12.5
        17
        2.7`);
    } catch (e) {
        console.log('e', e)
    }
});

bot.on('message', function (msg) {
    const fromId = msg.from.id;
    let resp = 'Your message is ';

    if (msg['text']) {
        if (setCommands.has(msg['text'])) return;
        new Promise((resolve, reject) => {
            const text = msg['text'].toLowerCase();
            if (text.search(/привет|hi|добр(.*) (д(.*)|вечер(.*)|утр(.))|здравствуй(.*)/) !== -1) {
                resolve('ПРИВЕТ');
            }
            if (text.search(/пока|до свидан(.*)|до встречи|прощай|до скорого/) !== -1) {
                resolve('ПОКА');
            }
            resolve(text)
        }).then(
            result => bot.sendMessage(fromId, result)
        )

    } else {
        if (msg['sticker']) {
            resp += `sticker`
        }
        if (msg['photo']) {
            resp += `photo`
        }
        try {
            bot.sendMessage(fromId, resp);
        } catch (e) {
            console.log('e', e)
        }
    }

});