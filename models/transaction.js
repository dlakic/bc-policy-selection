const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    blockchain: {
        type: String,
        default: '',
    },
    data: {
        type: String,
    },
    cost: {
        type: Number,
    },
    policyId: {
        type: mongoose.Schema.Types.ObjectId,
    }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
