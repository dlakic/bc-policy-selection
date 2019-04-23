const constants = require('../constants');

const {DEFAULT, DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;

function buildPolicy(requestBody = null, username) {
    const policy = {};
    const policyUsername = username ? username : '';
    if (!requestBody) {
        policy.username = policyUsername;
        policy.preferredBC = [];
        policy.currency = '';
        policy.cost = 0;
        policy.bcType = '';
        policy.bcTuringComplete = false;
        policy.interval = '';
        policy.bcBlockTime = 0;
        policy.bcDataSize = 0;
        policy.split = false;
        policy.costProfile = '';

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
        policy.bcTuringComplete = requestBody.bcTuringComplete || false;
        policy.interval = requestBody.interval;
        policy.bcTps = parseInt(requestBody.bcTps, 10);
        policy.bcBlockTime = parseInt(requestBody.bcBlockTime, 10);
        policy.bcDataSize = parseInt(requestBody.bcDataSize, 10);
        policy.split = requestBody.split;
        policy.costProfile = requestBody.costProfile;
    }

    return policy;
}

function cleanNumericalParams(blockchains) {
    const tps = [];
    const blockTime = [];
    const maxTrxSize = [];

    blockchains.forEach(blockchain => {
        tps.push(blockchain.tps);
        blockTime.push(blockchain.blockTime);
        maxTrxSize.push(blockchain.maxTrxSize);
    });

    tps.sort((a, b) => a - b);
    blockTime.sort((a, b) => a - b);
    maxTrxSize.sort((a, b) => a - b);

    return {
        tps: [...new Set(tps)],
        blockTime: [...new Set(blockTime)],
        maxTrxSize: [...new Set(maxTrxSize)],
    }
}


function sortPoliciesByPriority(policies) {
    const order = [DAILY, WEEKLY, MONTHLY, YEARLY, DEFAULT];
    return policies.sort((a, b) => order.indexOf(a.interval) - order.indexOf(b.interval));
}

function getLowerIntervals(threshold) {

    if (threshold === DAILY) {
        return [];
    }

    if (threshold === WEEKLY) {
        return [DAILY];
    }

    if (threshold === MONTHLY) {
        return [DAILY, WEEKLY];
    }

    if (threshold === YEARLY) {
        return [DAILY, WEEKLY, MONTHLY];
    }

    return [];
}

function getHigherIntervals(threshold) {

    if (threshold === DAILY) {
        return [WEEKLY, MONTHLY, YEARLY];
    }

    if (threshold === WEEKLY) {
        return [MONTHLY, YEARLY];
    }

    if (threshold === MONTHLY) {
        return [YEARLY];
    }

    if (threshold === YEARLY) {
        return [];
    }

    return [];
}

function isTransactionFeeFreeBlockchain(bcType) {
    return bcType === constants.blockchains.PSG.nameShort
        || bcType === constants.blockchains.MLC.nameShort
        || bcType === constants.blockchains.MIOTA.nameShort
        || bcType === constants.blockchains.HYP.nameShort;
}

module.exports = {
    buildPolicy,
    cleanNumericalParams,
    sortPoliciesByPriority,
    getLowerIntervals,
    getHigherIntervals,
    isTransactionFeeFreeBlockchain,
};