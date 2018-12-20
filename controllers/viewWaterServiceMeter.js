const WaterServiceMeter = require('../models/WaterServiceMeter');
const helpFunctions = require('../utils/helpFunctions');

module.exports = (ctx) => {
    const chatId = helpFunctions.getChatIdFromScene(ctx);
    WaterServiceMeter.findOne({chatId: chatId}, (err, meter) => {
        if (err) ctx.reply(`Возникла ошибка: ${err}`);
        else if (!meter) ctx.reply(`Возникла ошибка: Счетчик не найден`);
        else
            ctx.reply(`
Счетчики для водоснабжения:           
    Кухня горячая вода: ${meter.hotWaterKitchen};
    Ванная горячая вода: ${meter.hotWaterBathroom};
    Кухня холодная вода: ${meter.coldWaterKitchen};
    Ванная холодная вода: ${meter.coldWaterBathroom};`);
    })
};
