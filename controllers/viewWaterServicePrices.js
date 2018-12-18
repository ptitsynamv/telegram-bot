const Price = require('../models/Price');
const WizardScene = require("telegraf/scenes/wizard");
module.exports = new WizardScene(
    'viewWaterServicePrices',
    (ctx) => {
        const chatId = ctx.update.callback_query.from.id;
        return new Promise((resolve, reject) => {
            resolve(Price.findOne({serviceName: 'WaterService', chatId: chatId}))
        })
            .then(
                price => {
                    const {sewagePrice, hotWaterPrice, coldWaterPrice} = price.data;
                    ctx.reply(`цена горячей воды: ${hotWaterPrice}; 
цена холодной воды: ${coldWaterPrice}; 
цена канализации: ${sewagePrice};`);
                    return ctx.scene.leave();
                }
            )

    }
);