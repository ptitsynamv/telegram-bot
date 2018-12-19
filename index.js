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
const commands = require('./controllers/commands');

const bot = new Telegraf(keys.telegramToken);

bot.start((ctx) => commands(ctx));
bot.help((ctx) => commands(ctx));
bot.on('sticker', (ctx) => ctx.reply('👍'));
bot.hears('hi', (ctx) => ctx.reply('Hey there'));


const stage = new Stage();
stage.register(enterWaterServicePrices);
stage.register(enterWaterService);
stage.register(viewWaterServicePrices);
stage.register(enterWaterServiceMeter);
stage.register(viewWaterServiceMeter);
bot.use(session());
bot.use(stage.middleware());

bot.action("enterWaterServicePrices", (ctx) => ctx.scene.enter("enterWaterServicePrices"));
bot.action("enterWaterService", (ctx) => ctx.scene.enter("enterWaterService"));
bot.action("enterWaterServiceMeter", (ctx) => ctx.scene.enter("enterWaterServiceMeter"));
bot.action("viewWaterServicePrices", (ctx) => ctx.scene.enter("viewWaterServicePrices"));
bot.action("viewWaterServiceMeter", (ctx) => ctx.scene.enter("viewWaterServiceMeter"));
bot.startPolling();


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


const url = 'https://www.hts.kharkov.ua/KPHTS_v2_bill1PU.php?pg=1';
const Horseman = require('node-horseman');
const horseman = new Horseman();
const email = 'ptitsynamv@gmail.com';
const password = 'akindofmagic12';


function horsemanStart(email, password) {
    horseman
        .userAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.84 Safari/537.36')
        .open(url)
        .type('input[type=email]', email)
        .type('input[type=password]', password)
        .click('.message-block input[type="submit"]')
        .waitForNextPage()

        .text('.Header1')
        .then((text) => {
            console.log('text', text);
        })
        .click("a[href='KPHTS_v2_bill01PUNrazvilka.php']")
        .waitForNextPage()

        .text('div .ui-state-default')
        .then((text) => {
            console.log('text', text);
        })
        .type('input[name="0[ValueN]"]', 'test')
        .type('input[name="1[ValueN]"]', 'test')
        .click('input[type="submit"]')

        .waitForSelector('.info_errors')
        .text('.info_errors')
        .then((text) => {
            console.log('text', text);
        })
        .close();
}

// horsemanStart(email, password);