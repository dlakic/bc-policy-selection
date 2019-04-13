const BlockchainRepository = require('../repositories/blockchain-repository');
module.exports.selectBlockchain = async (policy) => {
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

    // filter out all Blockchains that do not correspond with wanted bcType
    blockchainPool = blockchainPool.filter(blockchain => blockchain.type === policy.bcType);

    if (blockchainPool.length === 1) {
        return blockchainPool;
    }

    // filter out all Blockchains that do not correspond with the tps threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.tps >= policy.bcTps);

    if (blockchainPool.length === 1) {
        return blockchainPool;
    }

    // filter out all Blockchains that do not correspond with the blocktime threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.blockTime <= policy.bcBlockTime);

    // filter out all Blockchains that do not correspond with the datasize threshold
    blockchainPool = blockchainPool.filter(blockchain => blockchain.maxTrxSize >= policy.bcDataSize);

    if (blockchainPool.length === 1) {
        return blockchainPool;
    }

    if (blockchainPool.length === 0) {
        const conflictError = new Error("Policy conflict detected, no blockchain with provided parameters available");
        conflictError.statusCode = 400;
        throw conflictError
    }

    return blockchainPool;

};