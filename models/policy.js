const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    preferredBC: {
        type: Array,
    },
    currency: {
        type: String,
    },
    cost: {
        type: Number,
    },
    interval: {
        type: String,
    },
    bcType: {
        type: String,
    },
    bcTps: {
        type: Number,
    },
    bcBlocktime: {
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
    },
    bcSmartContractLanguages: {
        type: Array,
    },
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
