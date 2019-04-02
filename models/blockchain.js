const mongoose = require('mongoose');

const blockchainSchema = new mongoose.Schema({
    nameShort: {
        type: String,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true,
        unique: true,
    },
    type: {
        type: String,
        required: true,
    },
    tps: {
        type: Number,
        required: true,
    },
    blockTime: {
        type: Number,
        required: true,
    },
    blockSize: {
        type: Number,
        required: true,
    },
    maxTrxSize: {
        type: Number,
        required: true,
    },
    smartContract: {
        type: Boolean,
        required: true,
    },
    smartContractLanguages: {
        type: Array,
        required: true,
    },
    // TODO: Maybe do this dynamically via api and not store directly into bcdata
    price: {
        type: Number,
        required: true,
    },
    trxFee: {
        type: Number,
        required: true,
    },

});

const Blockchain = mongoose.model('Blockchain', blockchainSchema);

module.exports = Blockchain;
