const costAPI = require('../api/cost-estimation');
const constants = require('../constants');
let PolicyModel = require('../models/policy');

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

