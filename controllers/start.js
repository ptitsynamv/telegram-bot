const WaterServiceMeter = require('../models/WaterServiceMeter');
const User = require('../models/User');
const Price = require('../models/Price');
const WizardScene = require("telegraf/scenes/wizard");
const Markup = require('telegraf/markup');

const {Observable, Subject, ReplaySubject, from, of, range, merge, combineLatest} = require('rxjs');
const {map, filter, switchMap} = require('rxjs/operators');


module.exports = new WizardScene(
    'start',
    (ctx) => {
        const chatId = ctx.update.message.from.id;
        return new Promise((resolve, reject) => {
            User.findOne({chatId: chatId}, (err, user) => {
                if (err) reject(err);
                resolve(user);
            })
        })
            .then(
                user => {
                    if (!user) {
                        ctx.reply('Введите свой адрес:');
                        return ctx.wizard.next();
                    }
                    else {
                        return getCommands(ctx);
                    }
                },
                err => {
                    console.error(err);
                    return ctx.scene.leave();
                }
            )
    },
    (ctx) => {
        return new Promise((resolve, reject) => {
            const address = ctx.message.text;
            const chatId = ctx.update.message.from.id;
            const username = ctx.update.message.from.username;

            const newUser = new User({chatId, address, username});
            newUser.save(err => {
                if (err) return reject(err);
                ctx.reply('Вы зарегистрировались в системе.');
                return resolve()
            })
        })
            .then(
                () => {
                    return getCommands(ctx);
                },
                err => {
                    console.error(err);
                    return ctx.scene.leave();
                }
            );
    },
);

function getCommands(ctx) {
    const chatId = ctx.update.message.from.id;
    const arrayCommands = [];
    arrayCommands.push(Markup.callbackButton("Ввести цены для водоснабжения", "enterWaterServicePrices"));
    arrayCommands.push(Markup.callbackButton("Ввести счетчики для водоснабжения", "enterWaterServiceMeter"));

    return combineLatest(
        Price.findOne({serviceName: 'WaterService', chatId: chatId}),
        WaterServiceMeter.findOne({chatId: chatId}),
    )
        .subscribe(([price, waterServiceMeter]) => {
            if (price) {
                arrayCommands.push(Markup.callbackButton("Посмотреть цены для водоснабжения", "viewWaterServicePrices"))
            }
            if (waterServiceMeter) {
                arrayCommands.push(Markup.callbackButton("Посмотреть счетчики для водоснабжения", "viewWaterServiceMeter"));
            }
            if (price && waterServiceMeter) {
                arrayCommands.push(Markup.callbackButton("Ввести показания для водоснабжения", "enterWaterService"));
            }
            ctx.reply("Выберите действие.",
                Markup.inlineKeyboard([...arrayCommands]).extra());
            return ctx.scene.leave();
        });
}
