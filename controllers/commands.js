const User = require('../models/User');
const Price = require('../models/Price');
const WaterServiceMeter = require('../models/WaterServiceMeter');
const Markup = require('telegraf/markup');

module.exports = (ctx) => {
    const chatId = ctx.update.message.from.id;
    const arrayCommands = [];
    let isHasPrice = false;
    new Promise((resolve, reject) => {
        resolve(User.findOne({chatId: chatId}))
    })
        .then(
            user => {
                if (!user) {
                    return new Promise((resolve, reject) => {
                        resolve(new User({
                            chatId: fromId,
                            username: username,
                        }).save());
                    })
                }
                return false
            })
        .then(isNewUser => {
            return isNewUser ? ctx.reply('Вы зарегистрировались в системе.') : ''
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                resolve(Price.findOne({serviceName: 'WaterService', chatId: chatId}))
            })
        })
        .then(price => {
            arrayCommands.push(Markup.callbackButton("Ввести цены для водоснабжения", "enterWaterServicePrices"));
            if (price) {
                isHasPrice = true;
                arrayCommands.push(Markup.callbackButton("Посмотреть цены для водоснабжения", "viewWaterServicePrices"))
            }
        })
        .then(() => {
            return new Promise((resolve, reject) => {
                resolve(WaterServiceMeter.findOne({chatId: chatId}))
            })
        })
        .then((waterServiceMeter) => {
            arrayCommands.push(Markup.callbackButton("Ввести счетчики для водоснабжения", "enterWaterServiceMeter"));
            if (waterServiceMeter) {
                arrayCommands.push(Markup.callbackButton("Посмотреть счетчики для водоснабжения", "viewWaterServiceMeter"));
                if (isHasPrice) {
                    arrayCommands.push(Markup.callbackButton("Ввести показания для водоснабжения", "enterWaterService"));
                }
            }
        })
        .then(() => {
            ctx.reply("Выберите действие.",
                Markup.inlineKeyboard([...arrayCommands]).extra())
        })
}