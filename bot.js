const mongoose = require('mongoose');
const keys = require('./config/keys');
const {Telegraf} = require('telegraf');
const scraping = require('./utils/scraping');
const {from} = require('rxjs');
const {concatMap, map} = require('rxjs/operators');
const Horseman = require('node-horseman');
const horseman = new Horseman();
const Article = require('./models/Article');
const express = require('express');
const expressApp = express();

try {
    mongoose.connect(keys.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("mongoose connected"));
} catch (error) {
    console.log("could not connect");
}

const PORT = process.env.PORT || 3000;
const URL = process.env.URL || keys.HEROKU_URL;

const bot = new Telegraf(keys.TELEGRAM_BOT_TOKEN);
bot.telegram.setWebhook(`${URL}/bot${keys.TELEGRAM_BOT_TOKEN}`);
expressApp.use(bot.webhookCallback(`/bot${keys.TELEGRAM_BOT_TOKEN}`));


bot.start((ctx) => ctx.reply('Welcome'));
bot.help((ctx) => ctx.reply(
    `/hi - check articles updated;
/add - add article;`
));
bot.command('hi', (ctx) => {
    ctx.reply(`please, wait...`);
    Article.find({}, 'title url')
        .then((data) => {
            from(data)
                .pipe(
                    map(({title, url}) => ({title, url})),
                    concatMap((d) => scraping.scrapingArticles(d, horseman))
                )
                .subscribe(
                    (result) => {
                        ctx.reply(`article: ${result.title}, 
url: ${result.url},
last updated: ${result.diff} days ago`)
                    },
                    (error) => {
                    },
                    () => {
                        return horseman.close();
                    },
                );

        });
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


process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

expressApp.get('/', (req, res) => {
    res.send('Hello World!');
});
expressApp.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
