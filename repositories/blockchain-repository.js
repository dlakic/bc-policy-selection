const BlockchainModel = require('../models/blockchain');

function getAllBlockchains() {
    return new Promise((resolve, reject) => {
        BlockchainModel.find({})
            .then(blockchains => {
                resolve(blockchains);
            })
            .catch(err => {
                console.error(err);
                reject(err)
            });
    })
}

module.exports = {
    getAllBlockchains,
};