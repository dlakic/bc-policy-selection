const PolicyModel = require('../models/policy');

function getAllPolicies() {
    return new Promise((resolve, reject) => {
        PolicyModel.find({})
            .then(policies => {
                resolve(policies);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function getPolicy(id) {
    return new Promise((resolve, reject) => {
    PolicyModel.findOne({'_id': id})
        .then(queriedPolicy => {
            resolve(queriedPolicy)
        })
        .catch(err => {
            console.error(err);
            reject(err);
        });
    });
}

function createPolicy(policy) {
    return new Promise((resolve, reject) => {
        PolicyModel.create(policy)
            .then(savedPolicy => {
                resolve(savedPolicy)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function deletePolicy(id) {
    return new Promise((resolve, reject) => {
        PolicyModel.deleteOne({'_id': id})
            .then(deletedPolicy => {
                resolve(deletedPolicy)
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

function getPolicyAndUpdate(id, policy) {
    return new Promise((resolve, reject) => {
        PolicyModel.findOneAndUpdate({'_id': id}, policy, {upsert: true})
            .then(() => {
                resolve(policy);
            })
            .catch(err => {
                console.error(err);
                reject(err);
            });
    });
}

module.exports = {
    getAllPolicies,
    getPolicy,
    createPolicy,
    deletePolicy,
    getPolicyAndUpdate,
};