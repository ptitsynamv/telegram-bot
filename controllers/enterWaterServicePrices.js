const Price = require('../models/Price');
const WizardScene = require("telegraf/scenes/wizard");
const helpFunctions = require('../utils/helpFunctions')

function validatePrice(ctx) {
    const price = ctx.message && ctx.message.text ? ctx.message.text : false;
    if (!price) return price;
    return !isNaN(parseFloat(price));
}


module.exports = new WizardScene(
    "enterWaterServicePrices",
    (ctx) => {
        ctx.reply(`Этап 1: цена горячей воды. (Например, 10.5). 
        Выйти из опции: 'Назад'`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx) || !validatePrice(ctx)) {
            return ctx.scene.leave()
        }
        ctx.scene.session.hotWaterPrice = parseFloat(ctx.message.text);
        ctx.reply('Этап 2: цена холодной воды. (Например, 10).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx) || !validatePrice(ctx)) {
            return ctx.scene.leave()
        }
        ctx.scene.session.coldWaterPrice = parseFloat(ctx.message.text);
        ctx.reply('Этап 3: цена канализации. (Например 10).');
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx) || !validatePrice(ctx)) {
            return ctx.scene.leave()
        }
        ctx.scene.session.sewagePrice = parseFloat(ctx.message.text);

        const {sewagePrice, hotWaterPrice, coldWaterPrice} = ctx.scene.session;
        ctx.reply(`
цена горячей воды: ${hotWaterPrice};
цена холодной воды: ${coldWaterPrice};
цена канализации: ${sewagePrice};
    Все правильно? (да, нет)`);
        return ctx.wizard.next();
    },
    (ctx) => {
        if (helpFunctions.leaveSceneCommands(ctx)) {
            return ctx.scene.leave()
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
                    price.save(err => {
                        if (err) return reject(err);
                        return resolve()
                    })
                } else {
                    new Price({
                        serviceName: 'WaterService',
                        chatId,
                        data
                    }).save(err => {
                        if (err) return reject(err);
                        return resolve()
                    })
                }
            })
        })
            .then(
                () => {
                    ctx.reply('Данные записаны успешно)).');
                    return ctx.scene.leave()
                },
                err => {
                    ctx.reply(`Ошибка: ${err}`);
                    return ctx.scene.leave()
                }
            )
    });



