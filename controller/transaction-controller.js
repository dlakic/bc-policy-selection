const PolicyModel = require('../models/policy');
const blockchainSelector = require('../business-logic/blockchain-selector')

module.exports.handleTransaction = (req, res) => {
    if (!req.body.username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    PolicyModel.find({'username': req.body.username})
        .then((policies) => {
            const selectedBlockchain = blockchainSelector.selectBlockchain(policies[0]);
            console.log(selectedBlockchain);
            return res.status(200).send(selectedBlockchain)
        })
        .catch(err => {
            console.error(err);
            return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
        });
};

/*module.exports.handlePolicy = (req, res) => {

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
};*/