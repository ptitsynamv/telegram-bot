const WaterServiceMeter = require('../models/WaterServiceMeter');
const WizardScene = require("telegraf/scenes/wizard");
module.exports = new WizardScene(
    'viewWaterServiceMeter',
    (ctx) => {
        const chatId = ctx.update.callback_query.from.id;
        return new Promise((resolve, reject) => {
            resolve(WaterServiceMeter.findOne({chatId: chatId}))
        })
            .then(
                meter => {
                    ctx.reply(`Кухня горячая вода: ${meter.hotWaterKitchen};
        Ванная горячая вода: ${meter.hotWaterBathroom};
        Кухня холодная вода: ${meter.coldWaterKitchen};
        Ванная холодная вода: ${meter.coldWaterBathroom};`);
                    return ctx.scene.leave();
                }
            )

    }
);