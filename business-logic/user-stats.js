const constants = require('../constants');
const {DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;
const {ECONOMIC, PERFORMANCE} = constants.costProfiles
const util = require('../util');

function getHighestCostThresholdForInterval(policies, interval) {
    if (!policies || policies.length === 0) {
        return 0;
    }
    const policiesForInterval = policies.filter(policy => policy.interval === interval);
    return Math.max.apply(Math, policiesForInterval.map(policy => {
        return policy.cost;
    }))
}

function getStatsForPolicy(policy, transactions) {
    const policyStats = {
        policyId: policy._id,
        cost: 0,
        transactions: 0,
        costThreshold: policy.cost,
    };
    const relevantTransactions = transactions.filter(transaction => transaction.policyId.equals(policy._id));
    relevantTransactions.forEach((transaction) => {
        policyStats.cost += transaction.cost;
        policyStats.transactions++;
    });

    return policyStats
}

function buildPolicyStats(policies, transactions) {
    const policyStats = [];
    if (!policies || policies.length === 0) {
        return policyStats;
    }

    policies.forEach((policy, index) => {
        policyStats[index] = getStatsForPolicy(policy, transactions);
    });

    return policyStats;

}

function getStatsForBlockchain(blockchain, transactions, policies) {
    const blockchainStats = {
        nameShort: blockchain.nameShort,
        economicTransactions: 0,
        performanceTransactions: 0
    };

    const relevantTransactions = transactions.filter(transaction => transaction.blockchain === blockchain.name);
    relevantTransactions.forEach((transaction) => {
        const policyOfTransaction = policies.find(policy => policy._id.equals(transaction.policyId));
        if(policyOfTransaction) {
            if (policyOfTransaction.costProfile === ECONOMIC) {
                blockchainStats.economicTransactions++;
            } else {
                blockchainStats.performanceTransactions++;
            }
        }
    });

    return blockchainStats
}


function buildBlockchainStats(blockchains, transactions, policies) {
    const blockchainStats = [];
    if (!blockchains || blockchains.length === 0) {
        return blockchainStats;
    }

    blockchains.forEach((blockchain, index) => {
        blockchainStats[index] = getStatsForBlockchain(blockchain, transactions, policies);
    });

    return blockchainStats;
}

function getUserStats(user, policies, blockchains, transactions) {
    const stats = {
        costDaily: user.costDaily.cost,
        costWeekly: user.costWeekly.cost,
        costMonthly: user.costMonthly.cost,
        costYearly: user.costYearly.cost,
        maxDailyCostThreshold: 0,
        maxWeeklyCostThreshold: 0,
        maxMonthlyCostThreshold: 0,
        maxYearlyCostThreshold: 0,
        policyStats: [],
        blockchainStats: []
    };

    if (!policies || policies.length === 0) {
        return stats;
    }
    const sortedPolicies = util.sortPoliciesByPriority(policies);
    stats.maxDailyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, DAILY);
    stats.maxWeeklyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, WEEKLY);
    stats.maxMonthlyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, MONTHLY);
    stats.maxYearlyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, YEARLY);
    stats.policyStats = buildPolicyStats(sortedPolicies, transactions);
    stats.blockchainStats = buildBlockchainStats(blockchains, transactions, sortedPolicies);


    return stats;
}

module.exports = {
    getUserStats
};