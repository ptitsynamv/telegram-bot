const WaterServiceMeter = require('../models/WaterServiceMeter');
const WaterService = require('../models/WaterService');
const WizardScene = require("telegraf/scenes/wizard");
const scrapingHotWater = require('../utils/scraping');
const keys = require('../environment/prod');


module.exports = new WizardScene(
    'enterWaterService',
    (ctx) => {
        const chatId = ctx.update.callback_query.from.id;
        return new Promise((resolve, reject) => {
            WaterServiceMeter.findOne({chatId}, (err, meter) => {
                if (err) reject(err);
                resolve(meter);
            })
        })
            .then(
                meter => {
                    ctx.scene.session.hotWaterKitchen = meter.hotWaterKitchen;
                    ctx.scene.session.hotWaterBathroom = meter.hotWaterBathroom;
                    ctx.scene.session.coldWaterKitchen = meter.coldWaterKitchen;
                    ctx.scene.session.coldWaterBathroom = meter.coldWaterBathroom;

                    ctx.reply(`Этап 1: Кухня Горячая вода №${meter.hotWaterKitchen}. 
(Например 2.381)`);
                    return ctx.wizard.next();
                }
            )
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const hotKittenValue = ctx.message.text;
        ctx.scene.session.hotKittenValue = hotKittenValue;

        ctx.reply(`Этап 2: Кухня Холодная вода №${ctx.scene.session.coldWaterKitchen}.
(Например 2.381)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const coldKittenValue = ctx.message.text;
        ctx.scene.session.coldKittenValue = coldKittenValue;

        ctx.reply(`Этап 3: Ванная Горячая вода №${ctx.scene.session.hotWaterBathroom}. 
(Например 2.381)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        const hotBathroomValue = ctx.message.text;
        ctx.scene.session.hotBathroomValue = hotBathroomValue;

        ctx.reply(`Этап 4: Ванная Холодная вода №${ctx.scene.session.coldWaterBathroom}.  
(Например 2.381)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "назад") {
            return ctx.scene.leave()
        }

        // TODO parse and validate
        ctx.scene.session.coldBathroomValue = ctx.message.text;

        const {hotKittenValue, coldKittenValue, hotBathroomValue, coldBathroomValue} = ctx.scene.session;
        const {hotWaterKitchen, coldWaterKitchen, hotWaterBathroom, coldWaterBathroom} = ctx.scene.session;

        ctx.reply(`Кухня Горячая вода (№${hotWaterKitchen}): ${hotKittenValue};
Кухня Холодная вода (№${coldWaterKitchen}): ${coldKittenValue};
Ванная Горячая вода (№${hotWaterBathroom}): ${hotBathroomValue};
Ванная Холодная вода (№${coldWaterBathroom}): ${coldBathroomValue};
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
        const {hotWaterKitchen, coldWaterKitchen, hotWaterBathroom, coldWaterBathroom} = ctx.scene.session;

        return new Promise((resolve, reject) => {
            const waterService = new WaterService({
                chatId,
                hotKittenValue,
                coldKittenValue,
                hotBathroomValue,
                coldBathroomValue
            });
            resolve(waterService.save())
        })
            .then(
                waterService => {
                    const now = new Date();
                    const message = `
${now.toLocaleDateString()}.
Гарячая вода: 
Счетчик №${hotWaterKitchen} - ${hotKittenValue}
Счетчик №${hotWaterBathroom} - ${hotBathroomValue}
Холодная вода: 
Счетчик №${coldWaterKitchen} - ${coldKittenValue}
Счетчик №${coldWaterBathroom} - ${coldBathroomValue}`;

                    ctx.reply(message);
                    ctx.reply('Данные записаны успешно)). Будем отправлять их на сайт водоканала? (да, нет)');
                    return ctx.wizard.next();
                }
            )
    },
    (ctx) => {
        if (ctx.message.text.toLowerCase() === "нет") {
            return ctx.scene.leave()
        }
        ctx.reply('Отправляем на сайт водоканала.');

        scrapingHotWater(keys.emailVodocanal, keys.passwordVodocanal)
            .then(
                (success) => {
                    ctx.reply('Норм. Все отправили)');
                    return ctx.scene.leave()
                }
            )
            .catch(
                (error) => {
                    ctx.reply(`Была ошибка: ${error}`);
                    return ctx.scene.leave()
                },
            );

    }
);