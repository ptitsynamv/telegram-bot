const WaterServiceMeter = require('../models/WaterServiceMeter');

module.exports = (ctx) => {
    const chatId = ctx.update.callback_query.from.id;
    WaterServiceMeter.findOne({chatId: chatId}, (err, meter) => {
        if (err) {
            ctx.reply(`Возникла ошибка: ${err}`);
        } else {
            ctx.reply(`
Счетчики для водоснабжения:           
    Кухня горячая вода: ${meter.hotWaterKitchen};
    Ванная горячая вода: ${meter.hotWaterBathroom};
    Кухня холодная вода: ${meter.coldWaterKitchen};
    Ванная холодная вода: ${meter.coldWaterBathroom};`);
        }
    })
};
