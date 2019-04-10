const PolicyRepository = require('../repositories/policy-repository');
const blockchainSelector = require('../business-logic/blockchain-selector');

module.exports.handleTransaction = async (req, res) => {
    if (!req.body.username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    try {
        const policies = await PolicyRepository.getPoliciesByUsername(req.body.username);
        if(!policies || policies.length === 0) {
            const error = new Error("No Policies Found with the provided username");
            error.statusCode = 404;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }
        //TODO: for all policies
        const selectedBlockchain =  await blockchainSelector.selectBlockchain(policies[1]);
        return res.status(200).send(selectedBlockchain)
    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err});
    }

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