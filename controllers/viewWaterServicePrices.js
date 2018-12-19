const Price = require('../models/Price');

module.exports = (ctx) => {
    const chatId = ctx.update.callback_query.from.id;
    Price.findOne({serviceName: 'WaterService', chatId: chatId}, (err, price) => {
        if (err) {
            ctx.reply(`Возникла ошибка: ${err}`);
        } else {
            const {sewagePrice, hotWaterPrice, coldWaterPrice} = price.data;
            ctx.reply(`
Цены для водоснабжения: 
    цена горячей воды: ${hotWaterPrice}; 
    цена холодной воды: ${coldWaterPrice}; 
    цена канализации: ${sewagePrice};`);
        }
    });
};

