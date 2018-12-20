const User = require('../models/User');
const Price = require('../models/Price');
const WaterServiceMeter = require('../models/WaterServiceMeter');
const {Observable, Subject, ReplaySubject, from, of, range, merge, combineLatest} = require('rxjs');
const Markup = require('telegraf/markup');

module.exports = (ctx) => {
    const chatId = ctx.update.message.from.id;
    const arrayCommands = [];
    arrayCommands.push(Markup.callbackButton("Ввести цены для водоснабжения", "enterWaterServicePrices"));
    arrayCommands.push(Markup.callbackButton("Ввести счетчики для водоснабжения", "enterWaterServiceMeter"));
    combineLatest(
        Price.findOne({serviceName: 'WaterService', chatId: chatId}),
        WaterServiceMeter.findOne({chatId: chatId}),
    )
        .subscribe(([price, waterServiceMeter]) => {
            if (price) {
                arrayCommands.push(Markup.callbackButton("Посмотреть цены для водоснабжения", "viewWaterServicePrices"))
            }
            if (waterServiceMeter) {
                arrayCommands.push(Markup.callbackButton("Посмотреть счетчики для водоснабжения", "viewWaterServiceMeter"));
                arrayCommands.push(Markup.callbackButton("Ввести показания для водоснабжения", "enterWaterService"));
            }
            ctx.reply("Выберите действие.",
                Markup.inlineKeyboard([...arrayCommands]).extra());
        });
};


