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

module.exports = {initSet, addRowInStr}
