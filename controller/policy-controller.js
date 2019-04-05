const costAPI = require('../api/cost-estimation');
const constants = require('../constants');
const PolicyModel = require('../models/policy');
const BlockchainModel = require('../models/blockchain');
const UserModel = require('../models/user');


module.exports.listPolicies = (req, res) => {
    PolicyModel.find({})
        .then((policies) => {
            return res.status(200).render('policies', {policies})
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', {error:err})
        });
};

module.exports.editPolicy = (req, res) => {
    BlockchainModel.find({})
        .then((blockchains) => {
            if(req.query.id) {
                PolicyModel.findOne({'_id': req.query.id})
                    .then(queriedPolicy => {
                        console.log(queriedPolicy);
                        return res.status(200).render('index', {policy : queriedPolicy, blockchains});
                    })
                    .catch(err => {
                        console.error(err);
                        res.status(500).render('error', {error:err})
                    });
            } else {
                const policy = {
                    username: '',
                    preferredBC: [],
                    currency: '',
                    cost: '',
                    bcType: '',

                };
                return res.status(200).render('index', {policy : policy , blockchains});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', {error:err})
        });
};


module.exports.listBlockchains = (req, res) => {
    BlockchainModel.find({})
        .then((blockchains) => {
            return res.status(200).send(blockchains);
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', {error:err})
        });
};

module.exports.savePolicy = (req, res) => {
    const providedPolicy = {
        username: req.body.username,
        preferredBC: req.body.preferredBC,
        currency: req.body.currency,
        cost: parseFloat(req.body.cost),
        bcType: req.body.bcType,
        bcSmartContract: req.body.bcSmartContract,
        bcSmartContractLanguages: req.body.bcSmartContractLanguages,
        interval: req.body.interval,
        bcTps: parseInt(req.body.bcTps, 10),
        bcBlockTime: parseInt(req.body.bcBlockTime, 10),
        bcBlockSize: parseInt(req.body.bcBlockSize, 10),
        bcDataSize: parseInt(req.body.bcDataSize, 10),
    };

    //TODO: Retrieve USerdata if available. Otherwise store new user
    PolicyModel.findOneAndUpdate({'username': providedPolicy.username}, providedPolicy, {upsert: true})
        .then(() => {
            return res.status(200).render('result', {policy: providedPolicy});
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', {error:err})
        });
};

