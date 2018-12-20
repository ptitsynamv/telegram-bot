const mongoose = require('mongoose');
const session = require("telegraf/session");
const Stage = require("telegraf/stage");
const keys = require('./config/keys');
const Telegraf = require('telegraf');
const cron = require("node-cron");
const WaterService = require('./models/WaterService');
const moment = require('moment');
const helpFunctions = require('./utils/helpFunctions');

mongoose.connect(keys.mongoUrl, {useNewUrlParser: true})
    .then(() => {
        console.log('mongo db connected');
    })
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
bot.on('sticker', (ctx) => bot.telegram.sendSticker(ctx.update.message.from.id, helpFunctions.getRandomSticker()));
bot.hears(/привет|hi|добр(.*) (д(.*)|вечер(.*)|утр(.))|здравствуй(.*)/i, (ctx) => ctx.reply('Привет'));
bot.hears(/пока|до свидан(.*)|до встречи|прощай|до скорого/i, (ctx) => ctx.reply('До встречи'));


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
    console.log('Error', err)
});


cron.schedule("1 1 20 18,19,20,21,22,23,24,25 * *", () => {
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
            },
            err => {
                bot.telegram.sendMessage(chatId, `Возникла ошибка: ${err}`)
            }
        );
});


require('http').createServer().listen(process.env.PORT || 5000).on('request', function(req, res){
    res.end('')
});