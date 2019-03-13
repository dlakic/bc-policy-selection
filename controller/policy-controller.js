const costAPI = require('../api/cost-estimation');
const constants = require('../constants');

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

module.exports.showPolicy = (req, res) => {

    const policy = {
        preferredBC: constants.blockchains[req.body.preferredBC].name,
        currency: req.body.currency,
        cost: req.body.cost,
        bcType: req.body.bcType,
    };
    console.log(policy);
    return res.status(200).render('result', {policy});
};

