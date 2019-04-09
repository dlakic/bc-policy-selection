const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    costDaily: {
        type: Number,
        default: 0,
    },
    costWeekly: {
        type: Number,
        default: 0,
    },
    costMonthly: {
        type: Number,
        default: 0,
    },
    costYearly: {
        type: Number,
        default: 0,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
