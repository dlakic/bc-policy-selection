const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    costDaily: {
        type: Number,
    },
    costWeekly: {
        type: Number,
    },
    costMonthly: {
        type: Number,
    },
    costYearly: {
        type: Number,
    },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
