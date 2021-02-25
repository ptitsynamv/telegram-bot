const {findArticle} = require('./controllers/articles');
const mongoose = require('mongoose');
const keys = require('./config/keys');
const {Telegraf} = require('telegraf')
const cron = require("node-cron");

mongoose.connect(keys.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) {
        console.log('Error', err);
        throw err
    }
    console.log('Successfully connected');
});

const bot = new Telegraf(keys.TELEGRAM_BOT_TOKEN)
bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply(
    `/hi - check articles updated;
/add - add article;`
));
bot.command('hi', (ctx) => {
    ctx.reply(`please, wait...`);

    function callback(msg) {
        ctx.reply(msg);
    }
    findArticle(callback);
});
bot.command('add', (ctx) => {
    ctx.reply(`todo`)
    // const article = new Article({
    //     title,
    //     url
    // });
    // return article.save(err => {
    //    console.log('newMeter')
    // })

});
bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))


cron.schedule("0 0 19 * * *", () => {
    console.log('cron');
    function callback(msg) {
        bot.telegram.sendMessage(keys.MY_CHAT_ID,msg)
    }
    findArticle(callback);
});
