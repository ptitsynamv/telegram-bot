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
    const message = ctx.message && ctx.message.text ? ctx.message.text.toLowerCase() : '';
    return message.search(/назад|-|отмена|вернуться/) !== -1;
};

module.exports = {initSet, addRowInStr, leaveSceneCommands}
