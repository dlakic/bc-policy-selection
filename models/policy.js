const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    preferredBC: {
        type: Array,
        required: true,
    },
    currency: {
        type: String,
        required: true,
    },
    cost: {
        type: String,
        required: true,
    },
    bcType: {
        type: String,
        required: true,
    },
});

const Policy = mongoose.model('Policy', policySchema);

module.exports = Policy;
