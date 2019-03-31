const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    policyId: {
        type: String,
        required: true,
        unique: true,
    },
    client: {
        type: String,
        required: true,
    },
    preferredBC: {
        type: Array,
    },
    currency: {
        type: String,
        required: true,
    },
    cost: {
        type: String,
    },
    bcType: {
        type: String,
    },
    bcThroghput: {
        type: Number,
    },
    bcBlocktime: {
        type: Number,
    },
    bcBlockSize: {
        type: Number,
    },
    bcSmartContract: {
        type: Boolean,
    },S
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
