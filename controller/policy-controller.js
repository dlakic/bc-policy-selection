const PolicyRepository = require('../repositories/policy-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
const UserRepository = require('../repositories/user-repository');
const blockchainSelector = require('../business-logic/blockchain-selector');
const util = require('../util');


module.exports.listPolicies = async (req, res) => {
    try {
        const policies = await PolicyRepository.getAllPolicies();
        return res.status(200).render('policies', {policies});
    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err});
    }

};

module.exports.editPolicy = async (req, res) => {
    try {
        const blockchains = await BlockchainRepository.getAllBlockchains();
        const choosableParams = util.cleanNumericalParams(blockchains);
        if (req.query.id) {
            const policy = await PolicyRepository.getPolicyById(req.query.id);
            return res.status(200).render('policy', {policy, choosableParams, blockchains});
        } else {
            return res.status(200).render('policy', {policy: util.buildPolicy(), choosableParams, blockchains});
        }

    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err})
    }
};


module.exports.listBlockchains = async (req, res) => {
    try {
        const blockchains = await BlockchainRepository.getAllBlockchains();
        return res.status(200).send(blockchains);
    } catch (err) {
        console.error(err);
        return res.status(500).render('error', {error: err})
    }
};

module.exports.savePolicy = async (req, res) => {
    if(!req.body.username) {
        const error = new Error("No username provided");
        error.statusCode = 400;
        return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
    }
    const providedPolicy = util.buildPolicy(req.body);
    const user = await UserRepository.getUserByName(req.body.username);

    // Check policy interval conflicts
    if(user) {
        let userPolicies = await PolicyRepository.getPoliciesByUsername(req.body.username);
        userPolicies = userPolicies.filter(policy => policy.interval === req.body.interval && !policy._id.equals(req.body._id));
        if(userPolicies && userPolicies.length > 0) {
            const error = new Error(`This user already has a policy for interval ${req.body.interval}`);
            error.statusCode = 400;
            return res.status(error.statusCode).send({statusCode: error.statusCode, message: error.message})
        }
    }

    try {
        await blockchainSelector.selectBlockchain(providedPolicy);
    } catch (err) {
        return res.status(err.statusCode).send({statusCode: err.statusCode, message: err.message})
    }

    if (req.body._id) {
        try {
            const updatedPolicy = await PolicyRepository.getPolicyAndUpdate(req.body._id, providedPolicy);

            // if user does not exist, create user
            if (!user || user.length === 0) {
                await UserRepository.createUser(req.body.username);
            }
            return res.status(200).render('result', {policy: updatedPolicy});
        } catch (err) {
            console.error(err);
            return res.status(500).render('error', {error: err});
        }
    } else {
        try {
            const createdPolicy = await PolicyRepository.createPolicy(providedPolicy);

            // if user does not exist, create user
            if (!user || user.length === 0) {
                await UserRepository.createUser(req.body.username);
            }
            return res.status(200).render('result', {policy: createdPolicy});
        } catch (err) {
            console.error(err);
            return res.status(500).render('error', {error: err});
        }
    }
};

module.exports.deletePolicy = async (req, res) => {
    const policyId = req.params.id;

    if (policyId) {
        try {
            await PolicyRepository.deletePolicy(policyId);
            return res.status(200).send({message: 'Policy deleted Successfully'});
        } catch (err) {
            console.error(err);
            return res.status(500).render('error', {error: err});
        }
    } else {
        return res.status(400).render('error', {error: 'No Policy Id provided'});
    }
};
