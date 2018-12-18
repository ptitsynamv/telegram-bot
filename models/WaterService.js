const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const waterServiceSchema = new Schema({
    chatId: {
        type: Number,
        required: true,
    },
    coldWater: {
        name: String,
        value: Number
    },
    hotWater: {
        name: String,
        value: Number
    },
    sewage: Number
});

module.exports = mongoose.model('waterServices', waterServiceSchema);