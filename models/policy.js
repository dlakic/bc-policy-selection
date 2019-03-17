import mongoose from 'mongoose';

const policySchema = new mongoose.Schema({
    preferredBC: {
        type: Array,
        required: true,
    },
    currency:{
        type: String,
        required: true,
    },
    cost: {
        type: String,
        required: true,
    },
    bcType:{
        type: String,
        required: true,
    },
});

const Policy = mongoose.model('Policy', policySchema);

export default Policy;