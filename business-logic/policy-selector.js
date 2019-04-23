const UserRepository = require('../repositories/user-repository');
const PolicyRepository = require('../repositories/policy-repository');
const constants = require('../constants');
const blockchainSelector = require('./blockchain-selector');
const costCalculator = require('./cost-calculator');

const {DAILY, WEEKLY, MONTHLY, YEARLY, DEFAULT} = constants.intervals;

async function selectPolicy(policies, user){
    // Mark all policies as inactive before setting the chosen one as active
    policies.forEach(policy => {
        policy.isActive = false;
        PolicyRepository.getPolicyAndUpdate(policy.id, policy);
    });

    const dailyPolicy = policies.find(policy => policy.interval === DAILY);

    if (dailyPolicy) {
        if(dailyPolicy.cost >= user.costDaily) {
            /*const validBlockchainsForPolicy = await blockchainSelector.selectBlockchain(dailyPolicy);
            const costs = await costCalculator.calculateCostForPolicy(dailyPolicy, validBlockchainsForPolicy);
            console.log(costs);
            //TODO:
            if(dailyPolicy.cost >= user.cost) {

            }*/
            dailyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(dailyPolicy.id, dailyPolicy);
            return dailyPolicy;
        }
    }

    const weeklyPolicy = policies.find(policy => policy.interval === WEEKLY);

    if (weeklyPolicy) {
        if(weeklyPolicy.cost >= user.costWeekly) {
            weeklyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(weeklyPolicy.id, weeklyPolicy);
            return weeklyPolicy;
        }
    }

    const monthlyPolicy = policies.find(policy => policy.interval === MONTHLY);

    if (monthlyPolicy) {
        if(monthlyPolicy.cost >= user.costMonthly) {
            monthlyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(monthlyPolicy.id, monthlyPolicy);
            return monthlyPolicy;
        }
    }

    const yearlyPolicy = policies.find(policy => policy.interval === YEARLY);

    if (yearlyPolicy) {
        if(yearlyPolicy.cost >= user.costYearly) {
            yearlyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(yearlyPolicy.id, yearlyPolicy);
            return yearlyPolicy;
        }
    }

    const defaultPolicy = policies.find(policy => policy.interval === DEFAULT);

    if (defaultPolicy) {
        defaultPolicy.isActive = true;
        PolicyRepository.getPolicyAndUpdate(defaultPolicy.id, defaultPolicy);
        return defaultPolicy;
    }

    const conflictError = new Error("Policy conflict detected: No applicable policy found");
    conflictError.statusCode = 500;
    throw conflictError
}

async function selectPolicyForTransaction(policies, username) {
    const currentlyActivePolicy = await selectPolicy(policies, username);
}

module.exports = {
    selectPolicy,
    selectPolicyForTransaction
};