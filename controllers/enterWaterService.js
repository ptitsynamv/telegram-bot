const Price = require('../models/Price');
const WizardScene = require("telegraf/scenes/wizard");
module.exports = new WizardScene(
    'enterWaterService',
    (ctx) => {
        ctx.reply('Этап 1: Кухня Горячая вода. (Например 2.381)');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const hotKittenValue = ctx.message.text;
        ctx.scene.session.hotKittenValue = hotKittenValue;

        ctx.reply('Этап 2: Кухня Холодная вода. (Например 2.381)');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const coldKittenValue = ctx.message.text;
        ctx.scene.session.coldKittenValue = coldKittenValue;

        ctx.reply('Этап 3: Ванная Горячая вода. (Например 2.381)');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const hotBathroomValue = ctx.message.text;
        ctx.scene.session.hotBathroomValue = hotBathroomValue;

        ctx.reply('Этап 4: Ванная Холодная вода. (Например 2.381)');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        ctx.scene.session.coldBathroomValue = ctx.message.text;

        const {hotKittenValue, coldKittenValue, hotBathroomValue, coldBathroomValue} = ctx.scene.session;
        ctx.reply(`Кухня Горячая вода: ${hotKittenValue};
Кухня Холодная вода: ${coldKittenValue};
Ванная Горячая вода: ${hotBathroomValue};
Ванная Холодная вода: ${coldBathroomValue};
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
        const {hotKittenValue, coldKittenValue, hotBathroomValue, coldBathroomValue} = ctx.scene.session;

        return ctx.scene.leave()

        // return new Promise((resolve, reject) => {
        //     Price.findOne({serviceName: 'WaterService', chatId}, (err, price) => {
        //         if (err) reject(err);
        //         const data = {
        //             hotWaterPrice,
        //             coldWaterPrice,
        //             sewagePrice
        //         };
        //         if (price) {
        //             price.data = data;
        //             resolve(price.save());
        //         } else {
        //             resolve(new Price({
        //                 serviceName: 'WaterService',
        //                 chatId,
        //                 data
        //             }).save())
        //         }
        //     })
        // })
        //     .then(
        //         // TODO error handler
        //         () => {
        //             ctx.reply('Данные записаны успешно)).');
        //             return ctx.scene.leave()
        //         }
        //     )
    }
)