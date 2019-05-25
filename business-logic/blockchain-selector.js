const BlockchainRepository = require('../repositories/blockchain-repository');
const constants = require('../constants');

function getBlockchainInfoByKey(key, blockchainInfo) {
    return blockchainInfo.find(blockchain => blockchain.nameShort === key)
}

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

async function selectBlockchainForTransaction(policy, bcCosts, viableBlockchains, alreadyUsedBlockchains, index) {
    let bcKey = '';
    const viableBcCosts = {};
    let blockchainSelectionPool = viableBlockchains;

    if (policy['split']) {
        blockchainSelectionPool = viableBlockchains.filter(blockchain => !alreadyUsedBlockchains.includes(blockchain.nameShort));
        if (blockchainSelectionPool.length === 0) {
            return alreadyUsedBlockchains[index];
        }
    }

    blockchainSelectionPool.forEach((viableBlockchain) => {
        viableBcCosts[viableBlockchain.nameShort] = bcCosts[viableBlockchain.nameShort];
    });
    if (policy.costProfile === constants.costProfiles.PERFORMANCE) {
        const mostPerformantBlockchain = blockchainSelectionPool.reduce((prev, current) => {
            return prev.tps > current.tps ? prev : (prev.tps === current.tps) ? ((viableBcCosts[prev.nameShort] < viableBcCosts[current.nameShort]) ? prev : current) : current;
        });
        bcKey = mostPerformantBlockchain.nameShort;
    } else {
        bcKey = Object.keys(viableBcCosts).reduce((prev, current) => {
            return viableBcCosts[prev] < viableBcCosts[current] ? prev : (viableBcCosts[prev] === viableBcCosts[current]) ? ((getBlockchainInfoByKey(prev, blockchainSelectionPool).tps > getBlockchainInfoByKey(current, blockchainSelectionPool).tps) ? prev : current) : current;
        });
    }

    return bcKey;
}

module.exports = {
    selectBlockchainFromPolicy,
    selectBlockchainForTransaction
};