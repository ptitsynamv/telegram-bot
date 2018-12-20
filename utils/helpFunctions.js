const initSet = () => {
    const set = new Set();
    set.add('/start');
    set.add('/enterWaterServicePrices');
    return set;
};

const addRowInStr = (str, newRow) => {
    str += '\n';
    return str + newRow;
};

const leaveSceneCommands = (ctx) => {
    const message = ctx.message && ctx.message.text ? ctx.message.text : '';
    return message.search(/назад|-|отмена|вернуться|нет|н/i) !== -1;
};

const errorSceneHandler = (ctx, err) => {
    ctx.reply(`Произошла ошибка: ${err}`);
    return ctx.scene.leave();
};

const getChatIdFromScene = (ctx) => {
    let chatId;
    if (ctx.update.callback_query && ctx.update.callback_query.from) {
        chatId = ctx.update.callback_query.from.id;
    } else if (ctx.update.message && ctx.update.message.from) {
        chatId = ctx.update.message.from.id;
    } else {
        chatId = 1;
    }
    return chatId;
};

const getRandomSticker = (min = 0, max = 5) => {
    const number = Math.floor(Math.random() * (max - min) + min);
    switch (number) {
        case 0:
            return 'CAADAgAECQAC1X6_AU7cRVVqvMUkAg';
        case 1:
            return 'CAADAQADmggAAr-MkAS7CXRSKPUROgI';
        case 2:
            return 'CAADAQAD4QADxYicBOKNRBh5AnZ5Ag';
        case 3:
            return 'CAADAQADrQADxYicBHxaZL7k6KvNAg';
        case 4:
            return 'CAADAgADQQEAAksODwABJlVW31Lsf6sC';
        default:
            return 'CAADAgADlQEAAksODwABYxWJPnhS7_IC';
    }
};

module.exports = {initSet, addRowInStr, leaveSceneCommands, errorSceneHandler, getChatIdFromScene, getRandomSticker};
