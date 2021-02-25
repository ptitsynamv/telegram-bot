require('dotenv').config();

const {findArticle} = require('./controllers/articles');
const mongoose = require('mongoose');
const {Telegraf} = require('telegraf')
const cron = require("node-cron");

mongoose.connect(process.env.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, function (err) {
    if (err) {
        console.log('Error', err);
        throw err
    }
    console.log('Successfully connected');
});

const index = new Telegraf(process.env.TELEGRAM_BOT_TOKEN)
index.start((ctx) => ctx.reply('Welcome'));
index.help((ctx) => ctx.reply(
    `/hi - check articles updated;
/add - add article;`
));
index.command('hi', (ctx) => {
    ctx.reply(`please, wait...`);

    function callback(msg) {
        ctx.reply(msg);
    }

    findArticle(callback);
});
index.command('add', (ctx) => {
    ctx.reply(`todo`)
    // const article = new Article({
    //     title,
    //     url
    // });
    // return article.save(err => {
    //    console.log('new article added')
    // })

});
index.launch();

process.once('SIGINT', () => index.stop('SIGINT'))
process.once('SIGTERM', () => index.stop('SIGTERM'))


cron.schedule("0 0 19 * * *", () => {
    function callback(msg) {
        index.telegram.sendMessage(process.env.MY_CHAT_ID, msg)
    }

    findArticle(callback);
});
