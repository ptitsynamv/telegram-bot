const WaterServiceMeter = require('../models/WaterServiceMeter');
const WaterService = require('../models/WaterService');
const User = require('../models/User');
const WizardScene = require("telegraf/scenes/wizard");
const scraping = require('../utils/scraping');
const keys = require('../environment/prod');
const helpFunctions = require('../utils/helpFunctions');

function validateMeterValue(ctx) {
    let value = ctx.message && ctx.message.text ? ctx.message.text : false;
    if (!value) return false;
    value = value.replace(/[^.,0-9]/gim, '');
    value = value.replace(',', '.');
    if (!value || isNaN(parseFloat(value))) return false;
    return parseFloat(value);
}

module.exports = new WizardScene(
    'enterWaterService',
    (ctx) => {
        const chatId = helpFunctions.getChatIdFromScene(ctx);
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
                },
                err => {
                    return helpFunctions.errorSceneHandler(ctx, err)
                }
            )
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave();
        }
        if (!validateMeterValue(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }

        ctx.scene.session.hotKittenValue = validateMeterValue(ctx);
        ctx.reply(`Этап 2: Кухня Холодная вода №${ctx.scene.session.coldWaterKitchen}.
(Например 2.381)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave();
        }
        if (!validateMeterValue(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }

        ctx.scene.session.coldKittenValue = validateMeterValue(ctx);
        ctx.reply(`Этап 3: Ванная Горячая вода №${ctx.scene.session.hotWaterBathroom}. 
(Например 2.381)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave();
        }
        if (!validateMeterValue(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }

        ctx.scene.session.hotBathroomValue = validateMeterValue(ctx);
        ctx.reply(`Этап 4: Ванная Холодная вода №${ctx.scene.session.coldWaterBathroom}.  
(Например 2.381)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave();
        }
        if (!validateMeterValue(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }

        ctx.scene.session.coldBathroomValue = validateMeterValue(ctx);
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
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave();
        }

        const chatId = helpFunctions.getChatIdFromScene(ctx);
        const {hotKittenValue, coldKittenValue, hotBathroomValue, coldBathroomValue} = ctx.scene.session;
        const {hotWaterKitchen, coldWaterKitchen, hotWaterBathroom, coldWaterBathroom} = ctx.scene.session;

        const waterService = new WaterService({
            chatId,
            hotKittenValue,
            coldKittenValue,
            hotBathroomValue,
            coldBathroomValue
        });

        return waterService.save(err => {
            if (err) return helpFunctions.errorSceneHandler(ctx, err);
            return User.findOne({chatId}, (err, user) => {
                if (err) return helpFunctions.errorSceneHandler(ctx, err);
                if (!user) return helpFunctions.errorSceneHandler(ctx, 'User nor found');

                const now = new Date();
                const message = `
${now.toLocaleDateString()}.
${user.address}.
Гарячая вода: 
Счетчик №${hotWaterKitchen} - ${hotKittenValue}
Счетчик №${hotWaterBathroom} - ${hotBathroomValue}
Холодная вода: 
Счетчик №${coldWaterKitchen} - ${coldKittenValue}
Счетчик №${coldWaterBathroom} - ${coldBathroomValue}`;

                ctx.reply(message);
                ctx.reply('Данные записаны успешно))');
                if (chatId === keys.idMasha) {
                    ctx.reply('Будем отправлять их на сайт Харьковводоканал? (да, нет)');
                    return ctx.wizard.next();
                }
                return ctx.scene.leave()
            })
        })
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave();
        }

        const {hotKittenValue, hotBathroomValue} = ctx.scene.session;
        ctx.reply(`Отправляем на сайт Харьковводоканал данные: 1. ${hotKittenValue}; 2. ${hotBathroomValue}.`);
        scraping.scrapingHotWater(keys.emailVodocanal, keys.passwordVodocanal, hotKittenValue.toString(), hotBathroomValue.toString())
            .then(
                (message) => {
                    ctx.reply(`Ответ от сайта: ${message}`);
                    return ctx.scene.leave()
                }
            )
            .catch(
                (error) => {
                    ctx.reply(`Ответ от сайта не было, проверьте сайт сами: ${scraping.url}`);
                    return ctx.scene.leave()
                },
            );

    }
);
