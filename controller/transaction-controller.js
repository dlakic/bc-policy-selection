const PolicyRepository = require('../repositories/policy-repository');
const blockchainSelector = require('../business-logic/blockchain-selector');
const policySelector = require('../business-logic/policy-selector');
const costCalculator = require('../business-logic/cost-calculator');

module.exports.handleTransaction = async (req, res) => {
    const username = req.body.username;
    if (!username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    try {
        const policies = await PolicyRepository.getPoliciesByUsername(username);
        if(!policies || policies.length === 0) {
            const error = new Error("No Policies Found with the provided username");
            error.statusCode = 404;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }
        const policy = await policySelector.selectPolicy(policies, username);
        /*const cost = await costCalculator.calculateCostForPolicy(policy);
        return res.status(200).send(cost)*/
        const selectedBlockchain =  await blockchainSelector.selectBlockchain(policy);
        return res.status(200).send(selectedBlockchain);
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
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