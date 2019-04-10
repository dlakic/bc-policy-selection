function buildPolicy(requestBody = null) {
    const policy = {};
    if (!requestBody) {
        policy.username = '';
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

module.exports = {
    buildPolicy,
};