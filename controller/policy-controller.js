const costAPI = require('../api/cost-estimation');
const constants = require('../constants');
const PolicyModel = require('../models/policy');
const BlockchainModel = require('../models/blockchain');
const UserModel = require('../models/user');
const PolicyRepository = require('../repositories/policy-repository');
const BlockchainRepository = require('../repositories/blockchain-repository');
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
            const policy = await PolicyRepository.getPolicy(req.query.id);
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

    if (req.body._id) {
        try {
            const updatedPolicy = await PolicyRepository.getPolicyAndUpdate(req.body._id, providedPolicy);
            return res.status(200).render('result', {policy: updatedPolicy});
        } catch (err) {
            console.error(err);
            return res.status(500).render('error', {error: err});
        }
    } else {
        try {
            const createdPolicy = await PolicyRepository.createPolicy(providedPolicy);
            return res.status(200).render('result', {policy: createdPolicy});
        } catch (err) {
            console.error(err);
            return res.status(500).render('error', {error: err});
        }
    }

};

