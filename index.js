// const mongoose = require('mongoose');
const keys = require('./config/keys');
const TelegramBot = require('node-telegram-bot-api');
const scraping = require('./utils/scraping');
const {from} = require('rxjs');
const {concatMap, map} = require('rxjs/operators');
const Horseman = require('node-horseman');
const horseman = new Horseman();
// const Article = require('./models/Article');


// try {
//     mongoose.connect(keys.MONGO_URL, {useNewUrlParser: true, useUnifiedTopology: true}, () =>
//         console.log("mongoose connected"));
// } catch (error) {
//     console.log("could not connect");
// }

const index = new TelegramBot(keys.TELEGRAM_BOT_TOKEN, {polling: true});

index.onText(/\/help/, (msg, match) => {
    const chatId = msg.chat.id;
    index.sendMessage(chatId, `/hi - check articles updated;
/add - add article;`);
});

index.onText(/\/hi/, (msg, match) => {
    const chatId = msg.chat.id;
    index.sendMessage(chatId, `please, wait...`);
    const data = [
        {
            title: 'Королевская канарейка',
            url: 'https://ficbook.net/readfic/9500650',
        },
        {
            title: 'Ава',
            url: 'https://ficbook.net/readfic/4582645',
        },
    ]

    from(data)
        .pipe(
            // map(({title, url}) => ({title, url})),
            concatMap((d) => scraping.scrapingArticles(d, horseman))
        )
        .subscribe(
            (result) => {
                index.sendMessage(chatId, `article: ${result.title},
url: ${result.url},
last updated: ${result.diff} days ago`)
            },
            (error) => {
            },
            () => {
                index.sendMessage(chatId, `complete`);
            },
        );

    // todo from DB
    // Article.find({}, 'title url')
    //     .then((data) => {
    //     });
});
index.onText(/\/add/, (msg, match) => {
    const chatId = msg.chat.id;
    index.sendMessage(chatId, `todo`)


    // const article = new Article({
    //     title,
    //     url
    // });
    // return article.save(err => {
    //    console.log('newMeter')
    // })

});


