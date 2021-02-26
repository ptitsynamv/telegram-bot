require('dotenv').config();

const mongoose = require('mongoose');
const {Telegraf} = require('telegraf');
const cron = require('node-cron');
const {MenuTemplate, MenuMiddleware} = require('telegraf-inline-menu');
const {findArticle} = require('./controllers/articles');

mongoose.connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}, function (err) {
    if (err) {
        console.log('Error', err);
        throw err
    }
    console.log('Mongoose successfully connected ');
});

const menuTemplate = new MenuTemplate(ctx => 'Select:');
menuTemplate.interact('Get data', 'get', {
    do: async (ctx) => {
        if (ctx.from.id === Number(process.env.MY_CHAT_ID)) {
            ctx.reply('please, wait...');
            findArticle(function callback(msg) {
                ctx.reply(msg);
            });
        } else {
            ctx.reply('todo');
        }
        return false;
    }
});
menuTemplate.interact('what is my name?', 'getName', {
    do: async ctx => {
        await ctx.reply(`Your name is ${ctx.from.first_name}`);
        return false;
    }
});

const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);
const menuMiddleware = new MenuMiddleware('/', menuTemplate);
bot.use(menuMiddleware);

bot.use((ctx, next) => {
    menuMiddleware.replyToContext(ctx)
    return next()
});

bot.launch();

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

cron.schedule('0 0 19 * * *', () => {
    findArticle(function callback(msg, difference) {
        if (difference === 0) {
            bot.telegram.sendMessage(process.env.MY_CHAT_ID, msg)
        }
    });
});
