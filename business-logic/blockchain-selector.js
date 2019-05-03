const BlockchainRepository = require('../repositories/blockchain-repository');
const constants = require('../constants');
async function selectBlockchainFromPolicy(policy) {
    let blockchainPool;

    if (!policy.preferredBC || policy.preferredBC.length === 0) {
        blockchainPool = await BlockchainRepository.getAllBlockchains();
    } else {
        blockchainPool = await BlockchainRepository.getBlockchainsByNameShort(policy.preferredBC);
    }

    // If only one preferred Policy, use that and don't execute rest of code.
    if (blockchainPool.length === 1) {
        return blockchainPool;
    }

    if (policy.bcType !== 'indifferent') {
        // filter out all Blockchains that do not correspond with wanted bcType
        blockchainPool = blockchainPool.filter(blockchain => blockchain.type === policy.bcType);
    }

    // filter out all Blockchains that do not correspond with the tps threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.tps >= policy.bcTps);

    // filter out all Blockchains that do not correspond with the blocktime threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.blockTime <= policy.bcBlockTime);

    // filter out all Blockchains that do not correspond with the datasize threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.maxTrxSize >= policy.bcDataSize);

    if (policy.bcTuringComplete === true) {
        // filter out all Blockchains that are not turingcomplete
        blockchainPool = blockchainPool.filter(blockchain => blockchain.turingComplete === true);
    }
    if (blockchainPool.length === 0) {
        const conflictError = new Error("Policy conflict detected, no blockchain with provided parameters available");
        conflictError.statusCode = 400;
        throw conflictError
    }

    return blockchainPool;

}

async function selectBlockchainForTransaction(policy, bcCosts, viableBlockchains) {
    let bcKey = '';
    if (policy.costProfile === constants.costProfiles.PERFORMANCE) {
        //TODO: use most performant currently it just uses cheapest
        bcKey =  viableBlockchains.reduce((prev, current) => {
            return prev.tps > current.tps ? prev.nameShort : current.nameShort
        });
        console.log (bcKey + bcCosts[bcKey]);
    } else {
        bcKey = Object.keys(bcCosts).reduce((prev, current) => {
            return bcCosts[prev] < bcCosts[current] ? prev : current
        });
        console.log(bcKey + bcCosts[bcKey]);
    }

    return bcKey;
}

module.exports = {
    selectBlockchainFromPolicy,
    selectBlockchainForTransaction
};