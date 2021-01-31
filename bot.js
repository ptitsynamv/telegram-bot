const mongoose = require('mongoose');
const keys = require('./config/keys');
const TelegramBot = require('node-telegram-bot-api');
const scraping = require('./utils/scraping');
const {from} = require('rxjs');
const {concatMap, map} = require('rxjs/operators');
const Horseman = require('node-horseman');
const horseman = new Horseman();
const Article = require('./models/Article');


try {
    mongoose.connect(keys.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
        console.log("mongoose connected"));
} catch (error) {
    console.log("could not connect");
}

const bot = new TelegramBot(keys.TELEGRAM_BOT_TOKEN, {polling: true});

bot.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId, `/hi - check articles updated;
/add - add article;`);
});

bot.onText(/\/hi/, (msg, match) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId,`please, wait...`);

    Article.find({}, 'title url')
        .then((data) => {
            from(data)
                .pipe(
                    map(({title, url}) => ({title, url})),
                    concatMap((d) => scraping.scrapingArticles(d, horseman))
                )
                .subscribe(
                    (result) => {
                        bot.sendMessage(chatId,`article: ${result.title},
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
bot.onText(/\/add/, (msg, match) => {
    const chatId = msg.chat.id;
    bot.sendMessage(chatId,`todo`)


    // const article = new Article({
    //     title,
    //     url
    // });
    // return article.save(err => {
    //    console.log('newMeter')
    // })

});


