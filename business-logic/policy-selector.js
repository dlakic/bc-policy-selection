const UserRepository = require('../repositories/user-repository');
module.exports.selectPolicy = async (policies, username) => {
    console.log(username);
    const user = await UserRepository.getUserByName(username);

    const dailyPolicy = policies.find(policy => policy.interval === 'daily');

    if (dailyPolicy) {
        if(dailyPolicy.cost > user.costDaily) {
            return dailyPolicy;
        }
    }

    const weeklyPolicy = policies.find(policy => policy.interval === 'weekly');

    if (weeklyPolicy) {
        if(weeklyPolicy.cost > user.costWeekly) {
            return weeklyPolicy;
        }
    }

    const monthlyPolicy = policies.find(policy => policy.interval === 'monthly');

    if (monthlyPolicy) {
        if(monthlyPolicy.cost > user.costMonthly) {
            return monthlyPolicy;
        }
    }

    const yearlyPolicy = policies.find(policy => policy.interval === 'yearly');

    if (yearlyPolicy) {
        if(yearlyPolicy.cost > user.costYearly) {
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