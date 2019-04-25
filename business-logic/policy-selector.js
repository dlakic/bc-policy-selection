const PolicyRepository = require('../repositories/policy-repository');
const constants = require('../constants');

const {DAILY, WEEKLY, MONTHLY, YEARLY, DEFAULT} = constants.intervals;

// TODO: Account for economic and performance
async function selectPolicy(policies, user) {
    // Mark all policies as inactive before setting the chosen one as active
    policies.forEach(policy => {
        policy.isActive = false;
        PolicyRepository.getPolicyAndUpdate(policy.id, policy);
    });

    const dailyPolicy = policies.find(policy => policy.interval === DAILY);

    if (dailyPolicy) {
        if (dailyPolicy.cost >= user.costDaily.cost) {
            dailyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(dailyPolicy.id, dailyPolicy);
            return dailyPolicy;
        }
    }

    const weeklyPolicy = policies.find(policy => policy.interval === WEEKLY);

    if (weeklyPolicy) {
        if (weeklyPolicy.cost >= user.costWeekly.cost) {
            weeklyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(weeklyPolicy.id, weeklyPolicy);
            return weeklyPolicy;
        }
    }

    const monthlyPolicy = policies.find(policy => policy.interval === MONTHLY);

    if (monthlyPolicy) {
        if (monthlyPolicy.cost >= user.costMonthly.cost) {
            monthlyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(monthlyPolicy.id, monthlyPolicy);
            return monthlyPolicy;
        }
    }

    const yearlyPolicy = policies.find(policy => policy.interval === YEARLY);

    if (yearlyPolicy) {
        if (yearlyPolicy.cost >= user.costYearly.cost) {
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

module.exports = {
    selectPolicy,
};