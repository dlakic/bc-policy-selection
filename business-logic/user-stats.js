const constants = require('../constants');
const {DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;
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
        policyStats.transactions++
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

function getUserStats(user, policies, transactions) {
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
    };

    if (!policies || policies.length === 0) {
        return stats;
    }
    const sortedPolicies =util.sortPoliciesByPriority(policies);
    stats.maxDailyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, DAILY);
    stats.maxWeeklyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, WEEKLY);
    stats.maxMonthlyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, MONTHLY);
    stats.maxYearlyCostThreshold = getHighestCostThresholdForInterval(sortedPolicies, YEARLY);
    stats.policyStats = buildPolicyStats(sortedPolicies, transactions);

    return stats;
}

module.exports = {
    getUserStats
};