const PolicyRepository = require('../repositories/policy-repository');
const UserRepository = require('../repositories/user-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
const blockchainSelector = require('../business-logic/blockchain-selector');
const policySelector = require('../business-logic/policy-selector');
const costCalculator = require('../business-logic/cost-calculator');
const userCostUpdater = require('../business-logic/user-cost-updater');

module.exports.handleTransaction = async (req, res) => {
    const username = req.body.username;
    if (!username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }
    userCostUpdater.costUpdater(user);
    try {
        const policies = await PolicyRepository.getPoliciesByUsername(username);
        if (!policies || policies.length === 0) {
            const error = new Error("No Policies Found with the provided username");
            error.statusCode = 404;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }
        const user = await UserRepository.getUserByName(username);
        const policy = await policySelector.selectPolicy(policies, user);
        /*const cost = await costCalculator.calculateCostForPolicy(policy);
        return res.status(200).send(cost)*/
        const selectedBlockchain = await blockchainSelector.selectBlockchain(policy);
        return res.status(200).send(selectedBlockchain);
    } catch (err) {
        console.error(err);
        return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
    }
};

module.exports.getBlockchainCost = async (req, res) => {
    const blockchainNameShort = req.params.blockchain;
    const currency = req.params.currency;
    if (!blockchainNameShort) {
        const error = new Error("No blockchain provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }

    try {
        const blockchain = await BlockchainRepository.getBlockchainsByNameShort(blockchainNameShort);
        if (!blockchain || blockchain.length === 0) {
            const error = new Error("No such blockchain found");
            error.statusCode = 400;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }
        const costs = await costCalculator.calculateCostForBlockchain(blockchainNameShort, currency);
        return res.status(200).send(costs);
    } catch (err) {
        return res.status(500).send(err)
    }
};