const PolicyRepository = require('../repositories/policy-repository');
const constants = require('../constants');
const moment = require('moment');

const {DAILY, WEEKLY, MONTHLY, YEARLY, DEFAULT} = constants.intervals;
const {ECONOMIC, PERFORMANCE} = constants.costProfiles;

function isPolicyInTimeFrame(policy) {
    if (policy.timeFrameStart === policy.timeFrameEnd) {
        return true;
    }
    const now = moment();
    const start = moment(policy.timeFrameStart, 'hh:mm');
    const end = moment(policy.timeFrameEnd, 'hh:mm');
    return now.isBetween(start, end, null, '[]');
}

function retrieveActivePolicyForInterval(policies, user) {
    let activePolicy = null;
    const policiesInTimeFrame = policies.filter(policy => isPolicyInTimeFrame(policy));
    const policiesPerformance = policiesInTimeFrame.filter(policy => policy.costProfile === PERFORMANCE);
    const policiesEconomic = policiesInTimeFrame.filter(policy => policy.costProfile === ECONOMIC);
    policiesPerformance.forEach((policy) => {
        if (policy.cost >= user.costDaily.cost) {
            policy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(policy.id, policy);
            activePolicy = policy;
        }
    });

    if(activePolicy) {
        return activePolicy;
    }

    policiesEconomic.forEach((policy) => {
        if (policy.cost >= user.costDaily.cost) {
            policy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(policy.id, policy);
            activePolicy = policy;
        }
    });

    return activePolicy;
}

async function selectPolicy(policies, user) {
    // Mark all policies as inactive before setting the chosen one as active
    policies.forEach(policy => {
        policy.isActive = false;
        PolicyRepository.getPolicyAndUpdate(policy.id, policy);
    });

    const dailyPolicies = policies.filter(policy => policy.interval === DAILY);

    if (dailyPolicies && dailyPolicies.length > 0) {
        let activeDailyPolicy = retrieveActivePolicyForInterval(dailyPolicies, user);
        if(activeDailyPolicy) {
            return activeDailyPolicy;
        }
    }

    const weeklyPolicy = policies.filter(policy => policy.interval === WEEKLY);

    if (weeklyPolicy) {
        let activeWeeklyPolicy = retrieveActivePolicyForInterval(weeklyPolicy, user);
        if(activeWeeklyPolicy) {
            return activeWeeklyPolicy;
        }
    }

    const monthlyPolicy = policies.filter(policy => policy.interval === MONTHLY);

    if (monthlyPolicy) {
        let activeMonthlyPolicy = retrieveActivePolicyForInterval(monthlyPolicy, user);
        if(activeMonthlyPolicy) {
            return activeMonthlyPolicy;
        }
    }

    const yearlyPolicy = policies.filter(policy => policy.interval === YEARLY);

    if (yearlyPolicy) {
        let activeYearlyPolicy = retrieveActivePolicyForInterval(yearlyPolicy, user);
        if(activeYearlyPolicy) {
            return activeYearlyPolicy;
        }
    }

    const defaultPolicy = policies.filter(policy => policy.interval === DEFAULT);

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