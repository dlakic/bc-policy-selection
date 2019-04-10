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

    if (blockchainPool.length === 0) {
        const conflictError = new Error("Policy conflict detected");
        conflictError.statusCode = 500;
        throw conflictError
    }

    return blockchainPool;

};