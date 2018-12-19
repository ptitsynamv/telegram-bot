const mongoose = require('mongoose');
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const keys = require('./environment/prod');
const Telegraf = require('telegraf');
const cron = require("node-cron");
const WaterService = require('./models/WaterService');
const moment = require('moment');

mongoose.connect(keys.mongoUrl, {useNewUrlParser: true})
    .then(() => console.log('mongo db connected'))
    .catch(error => console.log(error));


const enterWaterServicePrices = require('./controllers/enterWaterServicePrices');
const enterWaterService = require('./controllers/enterWaterService');
const viewWaterServicePrices = require('./controllers/viewWaterServicePrices');
const enterWaterServiceMeter = require('./controllers/enterWaterServiceMeter');
const viewWaterServiceMeter = require('./controllers/viewWaterServiceMeter');
const start = require('./controllers/start');
const commands = require('./controllers/commands');

const bot = new Telegraf(keys.telegramToken);

bot.help((ctx) => commands(ctx));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));


const stage = new Stage();
stage.register(enterWaterServicePrices);
stage.register(enterWaterService);
stage.register(enterWaterServiceMeter);
stage.register(start);
bot.use(session());
bot.use(stage.middleware());

bot.start((ctx) => ctx.scene.enter("start"));
bot.action("enterWaterServicePrices", (ctx) => ctx.scene.enter("enterWaterServicePrices"));
bot.action("enterWaterService", (ctx) => ctx.scene.enter("enterWaterService"));
bot.action("enterWaterServiceMeter", (ctx) => ctx.scene.enter("enterWaterServiceMeter"));
bot.action("viewWaterServicePrices", (ctx) => viewWaterServicePrices(ctx));
bot.action("viewWaterServiceMeter", (ctx) => viewWaterServiceMeter(ctx));
bot.startPolling();
bot.catch((err) => {
    console.log('Ooops', err)
});



cron.schedule("1 1 20 20,21,22,23,24,25 * *", function () {
    const chatId = keys.idMasha;
    const monthStart = new Date(moment().startOf('month').toDate());
    const monthEnd = new Date(moment().endOf('month').toDate());

    new Promise((resolve, reject) => {
        WaterService.findOne({
                chatId,
                date: {
                    $gt: monthStart,
                    $lt: monthEnd
                }
            }
            , (err, waterService) => {
                if (err) reject(err);
                resolve(waterService)
            });
    })
        .then(
            waterService => {
                if (!waterService) {
                    bot.telegram.sendMessage(chatId, 'Отправь данные о водоснабжении.');
                }
            }
        );
});

