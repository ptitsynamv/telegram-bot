const WaterServiceMeter = require('../models/WaterServiceMeter');
const WizardScene = require("telegraf/scenes/wizard");
const helpFunctions = require('../utils/helpFunctions');

function validateMeter(ctx) {
    const meter = ctx.message && ctx.message.text ? ctx.message.text : false;
    if (!meter) return false;
    return meter;
}


module.exports = new WizardScene(
    'enterWaterServiceMeter',
    (ctx) => {
        ctx.reply(`Этап 1: Номер счетчика Кухня горячая вода (Например с43001488). 
        Выйти из опции: Назад`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave()
        }
        if (!validateMeter(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }

        ctx.scene.session.hotWaterKitchen = validateMeter(ctx);
        ctx.reply('Этап 2: Номер счетчика Ванная горячая вода (Например с43001489).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave()
        }
        if (!validateMeter(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }
        ctx.scene.session.hotWaterBathroom = validateMeter(ctx);

        ctx.reply('Этап 3: Номер счетчика Кухня холодная вода (Например 17487392).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave()
        }
        if (!validateMeter(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }

        ctx.scene.session.coldWaterKitchen = validateMeter(ctx);

        ctx.reply('Этап 4: Номер счетчика Ванная холодная вода (Например 17487391).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave()
        }
        if (!validateMeter(ctx)) {
            ctx.reply('Неверный формат ввода.');
            return ctx.wizard.back();
        }

        ctx.scene.session.coldWaterBathroom = validateMeter(ctx);
        const {hotWaterKitchen, hotWaterBathroom, coldWaterKitchen, coldWaterBathroom} = ctx.scene.session;
        ctx.reply(`
Кухня горячая вода: ${hotWaterKitchen};
Ванная горячая вода: ${hotWaterBathroom};
Кухня холодная вода: ${coldWaterKitchen};
Ванная холодная вода: ${coldWaterBathroom};
    Все правильно? (да, нет)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            ctx.reply('Вы вышли из опции.');
            return ctx.scene.leave()
        }

        const chatId = helpFunctions.getChatIdFromScene(ctx);
        const {hotWaterKitchen, hotWaterBathroom, coldWaterKitchen, coldWaterBathroom} = ctx.scene.session;

        return WaterServiceMeter.findOne({chatId}, (err, meter) => {
            if (err) return helpFunctions.errorSceneHandler(ctx, err);

            if (meter) {
                meter.hotWaterKitchen = hotWaterKitchen;
                meter.hotWaterBathroom = hotWaterBathroom;
                meter.coldWaterKitchen = coldWaterKitchen;
                meter.coldWaterBathroom = coldWaterBathroom;
                return meter.save(err => {
                    if (err) return helpFunctions.errorSceneHandler(ctx, err);
                    ctx.reply('Данные успешно обновлены.');
                    return ctx.scene.leave();
                })
            }
            else {
                const newMeter = new WaterServiceMeter({
                    chatId,
                    hotWaterKitchen,
                    hotWaterBathroom,
                    coldWaterKitchen,
                    coldWaterBathroom
                });
                return newMeter.save(err => {
                    if (err) return helpFunctions.errorSceneHandler(ctx, err);
                    ctx.reply('Данные успешно записаны.');
                    return ctx.scene.leave();
                })
            }
        })
    }
);