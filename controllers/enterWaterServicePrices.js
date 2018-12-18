const Price = require('../models/Price');
const WizardScene = require("telegraf/scenes/wizard");

module.exports = new WizardScene(
    "enterWaterServicePrices",
    (ctx) => {
        ctx.reply(`Этап 1: цена горячей воды. (Например 10.5). 
        Выйти из опции: Назад`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const hotWaterPrice = ctx.message.text;
        ctx.scene.session.hotWaterPrice = hotWaterPrice;

        ctx.reply('Этап 2: цена холодной воды. (Например 10).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }
        // TODO parse and validate
        const coldWaterPrice = ctx.message.text;
        ctx.scene.session.coldWaterPrice = coldWaterPrice;

        ctx.reply('Этап 3: цена канализации. (Например 10).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }
        // TODO parse and validate
        ctx.scene.session.sewagePrice = ctx.message.text;

        const {sewagePrice, hotWaterPrice, coldWaterPrice} = ctx.scene.session;
        ctx.reply(`цена горячей воды: ${hotWaterPrice};
        цена холодной воды: ${coldWaterPrice};
        цена канализации: ${sewagePrice};
        Все правильно? (да, нет)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }
        if (ctx.message.text.toLowerCase() === "нет") {
            return ctx.scene.reenter()
        }
        const chatId = ctx.update.message.from.id;
        const {sewagePrice, hotWaterPrice, coldWaterPrice} = ctx.scene.session;

        return new Promise((resolve, reject) => {
            Price.findOne({serviceName: 'WaterService', chatId}, (err, price) => {
                if (err) reject(err);
                const data = {
                    hotWaterPrice,
                    coldWaterPrice,
                    sewagePrice
                };
                if (price) {
                    price.data = data;
                    resolve(price.save());
                } else {
                    resolve(new Price({
                        serviceName: 'WaterService',
                        chatId,
                        data
                    }).save())
                }
            })
        })
            .then(
                // TODO error handler
                () => {
                    ctx.reply('Данные записаны успешно)).');
                    return ctx.scene.leave()
                }
            )
    }
);
