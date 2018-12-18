const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    chatId: {
        type: Number,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('users', userSchema);