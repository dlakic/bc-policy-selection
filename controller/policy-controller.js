const PolicyRepository = require('../repositories/policy-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
const UserRepository = require('../repositories/user-repository');
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
        if (req.query.id) {
            const policy = await PolicyRepository.getPolicyById(req.query.id);
            console.log(policy);
            return res.status(200).render('policy', {policy: policy, blockchains});
        } else {
            console.log(util.buildPolicy());
            return res.status(200).render('policy', {policy: util.buildPolicy(), blockchains});
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
    const providedPolicy = util.buildPolicy(req.body);
    const user = await UserRepository.getUserByName(req.body.username);
    console.log(user);

    if (req.body._id) {
        try {
            const updatedPolicy = await PolicyRepository.getPolicyAndUpdate(req.body._id, providedPolicy);
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
