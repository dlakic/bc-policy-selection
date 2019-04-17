function buildPolicy(requestBody = null, username) {
    const policy = {};
    const policyUsername = username ? username : '';
    if (!requestBody) {
        policy.username = policyUsername;
        policy.preferredBC = [];
        policy.currency = '';
        policy.cost = 0;
        policy.bcType = '';
        policy.bcSmartContract = false;
        policy.bcSmartContractLanguages = [];
        policy.interval = '';
        policy.bcTps = 0;
        policy.bcBlockTime = 0;
        policy.bcBlockSize = 0;
        policy.bcDataSize = 0;

    } else if (requestBody.preferredBC && requestBody.preferredBC.length === 1) {
        policy.username = requestBody.username;
        policy.preferredBC = requestBody.preferredBC;
        policy.interval = 'default';
    } else {
        policy.username = requestBody.username;
        policy.preferredBC = requestBody.preferredBC || [];
        policy.currency = requestBody.currency;
        policy.cost = parseFloat(requestBody.cost);
        policy.bcType = requestBody.bcType;
        policy.bcSmartContract = requestBody.bcSmartContract || false;
        policy.bcSmartContractLanguages = requestBody.bcSmartContractLanguages || [];
        policy.interval = requestBody.interval;
        policy.bcTps = parseInt(requestBody.bcTps, 10);
        policy.bcBlockTime = parseInt(requestBody.bcBlockTime, 10);
        policy.bcBlockSize = parseInt(requestBody.bcBlockSize, 10);
        policy.bcDataSize = parseInt(requestBody.bcDataSize, 10);
    }

    return policy;
}

function cleanNumericalParams(blockchains) {
    const tps = [];
    const blockSize = [];
    const blockTime = [];
    const maxTrxSize = [];

    blockchains.forEach(blockchain => {
        tps.push(blockchain.tps);
        blockSize.push(blockchain.blockSize);
        blockTime.push(blockchain.blockTime);
        maxTrxSize.push(blockchain.maxTrxSize);
    });

    tps.sort((a, b) => a - b);
    blockSize.sort((a, b) => a - b);
    blockTime.sort((a, b) => a - b);
    maxTrxSize.sort((a, b) => a - b);

    return {
        tps: [...new Set(tps)],
        blockSize: [...new Set(blockSize)],
        blockTime: [...new Set(blockTime)],
        maxTrxSize: [...new Set(maxTrxSize)],
    }
}


function sortPoliciesByPriority(policies) {
    const order = ['daily', 'weekly', 'monthly', 'yearly', 'default'];
    return policies.sort((a, b) => order.indexOf(a.interval) > order.indexOf(b.interval));
}
module.exports = {
    buildPolicy,
    cleanNumericalParams,
    sortPoliciesByPriority,
};