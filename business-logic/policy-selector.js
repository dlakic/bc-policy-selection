const UserRepository = require('../repositories/user-repository');
const blockchainSelector = require('./blockchain-selector');
const costCalculator = require('./cost-calculator');

module.exports.selectPolicy = async (policies, username) => {
    const user = await UserRepository.getUserByName(username);

    const dailyPolicy = policies.find(policy => policy.interval === 'daily');

    if (dailyPolicy) {
        if(dailyPolicy.cost >= user.costDaily) {
            const validBlockchainsForPolicy = await blockchainSelector.selectBlockchain(dailyPolicy);
            const costs = await costCalculator.calculateCostForPolicy(dailyPolicy, validBlockchainsForPolicy);
            console.log(costs);
            //TODO: return cheapest
            if(dailyPolicy.cost >= user.cost) {

            }
            return dailyPolicy;
        }
    }

    const weeklyPolicy = policies.find(policy => policy.interval === 'weekly');

    if (weeklyPolicy) {
        if(weeklyPolicy.cost >= user.costWeekly) {
            return weeklyPolicy;
        }
    }

    const monthlyPolicy = policies.find(policy => policy.interval === 'monthly');

    if (monthlyPolicy) {
        if(monthlyPolicy.cost >= user.costMonthly) {
            return monthlyPolicy;
        }
    }

    const yearlyPolicy = policies.find(policy => policy.interval === 'yearly');

    if (yearlyPolicy) {
        if(yearlyPolicy.cost >= user.costYearly) {
            return yearlyPolicy;
        }
    }

    const defaultPolicy = policies.find(policy => policy.interval === 'default');

    if (defaultPolicy) {
        return defaultPolicy;
    }

    const conflictError = new Error("Policy conflict detected: No applicable policy found");
    conflictError.statusCode = 500;
    throw conflictError
};