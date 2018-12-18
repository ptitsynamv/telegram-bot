const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const recordSchema = new Schema({
    chatId: {
        type: Number,
        required: true,
    },
    serviceId: {
        type: Schema.Types.ObjectId
    },
    date: {
        type: Date,
        default: Date.now()
    },
});

module.exports = mongoose.model('records', recordSchema);