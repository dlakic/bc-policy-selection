const mongoose = require('mongoose');

const blockchainSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
    },
    public: {
        type: Boolean,
        required: true,
    },
    throughput: {
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
    smartContract: {
        type: Boolean,
        required: true,
    },
});

const Blockchain = mongoose.model('Blockchain', blockchainSchema);

module.exports = Blockchain;
