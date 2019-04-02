const costAPI = require('../api/cost-estimation');
const constants = require('../constants');
const PolicyModel = require('../models/policy');
const BlockchainModel = require('../models/blockchain');

module.exports.listPolicies = (req, res) => {

    PolicyModel.find({})
        .then((policies) => {
            return res.status(200).render('policies', {policies})
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', err)
        });

};

module.exports.editPolicy = (req, res) => {
    if(req.query.id) {
        PolicyModel.findOne({'_id': req.query.id})
            .then(queriedPolicy => {
                if (queriedPolicy) {
                    console.log(queriedPolicy);
                    return res.status(200).render('index', {policy : queriedPolicy});
                } else {
                    const policy = {
                        username: '',
                        preferredBC: [],
                        currency: '',
                        cost: '',
                        bcType: '',

                    };
                    return res.status(200).render('index', {policy : policy});
                }
            })
            .catch(err => {
                console.error(err);
                res.status(500).render('error', err)
            });
    }
};


module.exports.listBlockchains = (req, res) => {

    BlockchainModel.find({})
        .then((policies) => {
            return res.status(200).send(policies);
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', err)
        });
};



module.exports.handlePolicy = (req, res) => {

    const policy = {
        currency: req.query.currency,
        cost: req.query.cost,
        bcType: req.query.bcType,
    };

    if (req.query.bcType === 'private') {
        return res.status(200).render('result', {blockchain: constants.blockchains.multichain.name, policy});
    }

    const blockChainCost = costAPI.fetchBlockchainCost(policy.currency)
        .then((result) => {
                res.status(200).send(result);
            }
        );
};

module.exports.savePolicy = (req, res) => {
    const providedPolicy = {
        username: req.body.username,
        preferredBC: req.body.preferredBC,
        currency: req.body.currency,
        cost: req.body.cost,
        bcType: req.body.bcType,
    };
    console.log(providedPolicy);

    PolicyModel.findOneAndUpdate({'username': providedPolicy.username}, providedPolicy, {upsert: true})
        .then(() => {

            return res.status(200).render('result', {policy: providedPolicy});
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', err)
        });

};

