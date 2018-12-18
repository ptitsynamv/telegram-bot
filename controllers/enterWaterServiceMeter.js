const WaterServiceMeter = require('../models/WaterServiceMeter');
const WizardScene = require("telegraf/scenes/wizard");

module.exports = new WizardScene(
    'enterWaterServiceMeter',
    (ctx) => {
        ctx.reply(`Этап 1: Номер счетчика Кухня горячая вода (Например с43001488). 
        Выйти из опции: Назад`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const hotWaterKitchen = ctx.message.text;
        ctx.scene.session.hotWaterKitchen = hotWaterKitchen;

        ctx.reply('Этап 2: Номер счетчика Ванная горячая вода (Например с43001489).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const hotWaterBathroom = ctx.message.text;
        ctx.scene.session.hotWaterBathroom = hotWaterBathroom;

        ctx.reply('Этап 3: Номер счетчика Кухня холодная вода (Например 17487392).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const coldWaterKitchen = ctx.message.text;
        ctx.scene.session.coldWaterKitchen = coldWaterKitchen;

        ctx.reply('Этап 4: Номер счетчика Ванная холодная вода (Например 17487391).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        ctx.scene.session.coldWaterBathroom = ctx.message.text;

        const {hotWaterKitchen, hotWaterBathroom, coldWaterKitchen, coldWaterBathroom} = ctx.scene.session;
        ctx.reply(`Кухня горячая вода: ${hotWaterKitchen};
        Ванная горячая вода: ${hotWaterBathroom};
        Кухня холодная вода: ${coldWaterKitchen};
        Ванная холодная вода: ${coldWaterBathroom};
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
        const {hotWaterKitchen, hotWaterBathroom, coldWaterKitchen, coldWaterBathroom} = ctx.scene.session;

        return new Promise((resolve, reject) => {
            WaterServiceMeter.findOne({chatId}, (err, price) => {
                if (err) reject(err);
                if (price) {
                    price.hotWaterKitchen = hotWaterKitchen;
                    price.hotWaterBathroom = hotWaterBathroom;
                    price.coldWaterKitchen = coldWaterKitchen;
                    price.coldWaterBathroom = coldWaterBathroom;
                    resolve(price.save());
                } else {
                    resolve(new WaterServiceMeter({
                        chatId,
                        hotWaterKitchen, hotWaterBathroom, coldWaterKitchen, coldWaterBathroom
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
)