const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    preferredBC: {
        type: Array,
        default: [],
    },
    currency: {
        type: String,
        enum: ['CHF', 'EUR', 'USD'],
        default: 'CHF',
    },
    cost: {
        type: Number,
    },
    interval: {
        type: String,
        enum: ['daily', 'weekly', 'monthly', 'yearly', 'default']
    },
    bcType: {
        type: String,
    },
    bcTps: {
        type: Number,
    },
    bcBlockTime: {
        type: Number,
    },
    bcDataSize: {
        type: Number,
    },
    bcTuringComplete: {
        type: Boolean,
        default: false,
    },
    split: {
        type: Boolean,
        default: false,
    },
    timeframeStart: {
        type: Number,
    },
    timeframeEnd: {
        type: Number,
    },
    costProfile: {
        type: String,
        enum: ['economic', 'performance'],
        default: 'economic',
    }
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
