const UserRepository = require('../repositories/user-repository');
const PolicyRepository = require('../repositories/policy-repository');
const blockchainSelector = require('./blockchain-selector');
const costCalculator = require('./cost-calculator');

module.exports.selectPolicy = async (policies, username) => {
    const user = await UserRepository.getUserByName(username);

    const dailyPolicy = policies.find(policy => policy.interval === 'daily');

    policies.forEach(policy => {
       policy.isActive = false;
       PolicyRepository.getPolicyAndUpdate(policy.id, policy);
    });

    if (dailyPolicy) {
        if(dailyPolicy.cost >= user.costDaily) {
            const validBlockchainsForPolicy = await blockchainSelector.selectBlockchain(dailyPolicy);
            const costs = await costCalculator.calculateCostForPolicy(dailyPolicy, validBlockchainsForPolicy);
            console.log(costs);
            //TODO: return cheapest
            if(dailyPolicy.cost >= user.cost) {

            }
            dailyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(dailyPolicy.id, dailyPolicy);
            return dailyPolicy;
        }
    }

    const weeklyPolicy = policies.find(policy => policy.interval === 'weekly');

    if (weeklyPolicy) {
        if(weeklyPolicy.cost >= user.costWeekly) {
            weeklyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(weeklyPolicy.id, weeklyPolicy);
            return weeklyPolicy;
        }
    }

    const monthlyPolicy = policies.find(policy => policy.interval === 'monthly');

    if (monthlyPolicy) {
        if(monthlyPolicy.cost >= user.costMonthly) {
            monthlyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(monthlyPolicy.id, monthlyPolicy);
            return monthlyPolicy;
        }
    }

    const yearlyPolicy = policies.find(policy => policy.interval === 'yearly');

    if (yearlyPolicy) {
        if(yearlyPolicy.cost >= user.costYearly) {
            yearlyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(yearlyPolicy.id, yearlyPolicy);
            return yearlyPolicy;
        }
    }

    const defaultPolicy = policies.find(policy => policy.interval === 'default');

    if (defaultPolicy) {
        defaultPolicy.isActive = true;
        PolicyRepository.getPolicyAndUpdate(defaultPolicy.id, defaultPolicy);
        return defaultPolicy;
    }

    const conflictError = new Error("Policy conflict detected: No applicable policy found");
    conflictError.statusCode = 500;
    throw conflictError
};