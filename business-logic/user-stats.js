const constants = require('../constants');
const {DAILY, WEEKLY, MONTHLY, YEARLY} = constants.intervals;

function getHighestCostThresholdForInterval(policies, interval) {
    if (!policies || policies.length === 0) {
        return 0;
    }
    const policiesForInterval = policies.filter(policy => policy.interval === interval);
    return Math.max.apply(Math, policiesForInterval.map(policy => {
        return policy.cost;
    }))
}

function getUserStats(user, policies) {
    const stats = {
        costDaily: user.costDaily.cost,
        costWeekly: user.costWeekly.cost,
        costMonthly: user.costMonthly.cost,
        costYearly: user.costYearly.cost,
        maxDailyCostThreshold: 0,
        maxWeeklyCostThreshold: 0,
        maxMonthlyCostThreshold: 0,
        maxYearlyCostThreshold: 0,
    };

    if (!policies || policies.length === 0) {
        return stats;
    }

    stats.maxDailyCostThreshold = getHighestCostThresholdForInterval(policies, DAILY);
    stats.maxWeeklyCostThreshold = getHighestCostThresholdForInterval(policies, WEEKLY);
    stats.maxMonthlyCostThreshold = getHighestCostThresholdForInterval(policies, MONTHLY);
    stats.maxYearlyCostThreshold = getHighestCostThresholdForInterval(policies, YEARLY);

    return stats;
}

module.exports = {
    getUserStats
};