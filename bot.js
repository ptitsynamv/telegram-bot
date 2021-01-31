const mongoose = require('mongoose');
const keys = require('./config/keys');
const {Telegraf, session} = require('telegraf')
const cron = require("node-cron");
const scraping = require('./utils/scraping');
const {from} = require('rxjs');
const {concatMap, map} = require('rxjs/operators');
const Horseman = require('node-horseman');
const horseman = new Horseman();

const Article = require('./models/Article');

mongoose.connect(keys.MONGO_URL,  { useNewUrlParser: true, useUnifiedTopology: true  } )
    .then(() => {
        console.log('mongo db connected');
    })
    .catch(error => console.log(error));


const bot = new Telegraf(keys.TELEGRAM_BOT_TOKEN)
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

process.once('SIGINT', () => bot.stop('SIGINT'))
process.once('SIGTERM', () => bot.stop('SIGTERM'))



// cron.schedule("1 1 20 18,19,20,21,22,23,24,25 * *", () => {
//     const chatId = keys.idMasha;
//     const monthStart = new Date(moment().startOf('month').toDate());
//     const monthEnd = new Date(moment().endOf('month').toDate());
//
//     new Promise((resolve, reject) => {
//         WaterService.findOne({
//                 chatId,
//                 date: {
//                     $gt: monthStart,
//                     $lt: monthEnd
//                 }
//             }
//             , (err, waterService) => {
//                 if (err) reject(err);
//                 resolve(waterService)
//             });
//     })
//         .then(
//             waterService => {
//                 if (!waterService) {
//                     bot.telegram.sendMessage(chatId, 'Отправь данные о водоснабжении.');
//                 }
//             },
//             err => {
//                 bot.telegram.sendMessage(chatId, `Возникла ошибка: ${err}`)
//             }
//         );
// });
