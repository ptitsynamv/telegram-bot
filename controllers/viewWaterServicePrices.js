const Price = require('../models/Price');
const helpFunctions = require('../utils/helpFunctions');

module.exports = (ctx) => {
    const chatId = helpFunctions.getChatIdFromScene(ctx);
    Price.findOne({serviceName: 'WaterService', chatId: chatId}, (err, price) => {
        if (err) ctx.reply(`Возникла ошибка: ${err}`);
        else if (!price) ctx.reply(`Возникла ошибка: Цена не найдена`);
        else {
            const {sewagePrice, hotWaterPrice, coldWaterPrice} = price.data;
            ctx.reply(`
Цены для водоснабжения: 
    цена горячей воды: ${hotWaterPrice}; 
    цена холодной воды: ${coldWaterPrice}; 
    цена канализации: ${sewagePrice};`);
        }
    });
};

