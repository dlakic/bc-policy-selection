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
    bcBlockSize: {
        type: Number,
    },
    bcDataSize: {
        type: Number,
    },
    bcSmartContract: {
        type: Boolean,
        default: false,
    },
    bcSmartContractLanguages: {
        type: Array,
        default: [],
    },
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
