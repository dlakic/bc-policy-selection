const UserRepository = require('../repositories/user-repository');
const PolicyRepository = require('../repositories/policy-repository');
const constants = require('../constants');
const blockchainSelector = require('./blockchain-selector');
const ratesAPI = require('../api/bc-rates');
const costCalculator = require('./cost-calculator');
const util = require('../util');

const {DAILY, WEEKLY, MONTHLY, YEARLY, DEFAULT} = constants.intervals;

async function selectPolicy(policies, user){
    // Mark all policies as inactive before setting the chosen one as active
    policies.forEach(policy => {
        policy.isActive = false;
        PolicyRepository.getPolicyAndUpdate(policy.id, policy);
    });

    const dailyPolicy = policies.find(policy => policy.interval === DAILY);

    if (dailyPolicy) {
        if(dailyPolicy.cost >= user.costDaily.cost) {
            dailyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(dailyPolicy.id, dailyPolicy);
            return dailyPolicy;
        }
    }

    const weeklyPolicy = policies.find(policy => policy.interval === WEEKLY);

    if (weeklyPolicy) {
        if(weeklyPolicy.cost >= user.costWeekly.cost) {
            weeklyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(weeklyPolicy.id, weeklyPolicy);
            return weeklyPolicy;
        }
    }

    const monthlyPolicy = policies.find(policy => policy.interval === MONTHLY);

    if (monthlyPolicy) {
        if(monthlyPolicy.cost >= user.costMonthly.cost) {
            monthlyPolicy.isActive = true;
            PolicyRepository.getPolicyAndUpdate(monthlyPolicy.id, monthlyPolicy);
            return monthlyPolicy;
        }
    }

    const yearlyPolicy = policies.find(policy => policy.interval === YEARLY);

    if (yearlyPolicy) {
        if(yearlyPolicy.cost >= user.costYearly.cost) {
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

async function selectPolicyForTransaction(policies, user, violationData) {
    const currentlyActivePolicy = await selectPolicy(policies, user);
    const viableBlockchains = await blockchainSelector.selectBlockchain(currentlyActivePolicy);
    // TODO: Switch back to API for prod
    //const publicBlockchainsString = util.publicBlockchainsForCostRequest();
    //const blockchainRates = await ratesAPI.fetchBlockchainCost(currentlyActivePolicy.currency, publicBlockchainsString);
    const blockchainRates = await ratesAPI.fetchBlockchainCostNOAPI();
    const viableBlockchainRates = {};
    viableBlockchains.forEach((viableBlockchain) => {
        viableBlockchainRates[viableBlockchain.nameShort] = blockchainRates[viableBlockchain.nameShort];
    });
    const costs = [];
    await Promise.all(
        violationData.violations.map(async (sheetData) => {
            const costsforSheet = await costCalculator.calculateCosts(viableBlockchainRates, sheetData.sizeString);
            costs.push(costsforSheet);
        })
    );


    if(currentlyActivePolicy.costProfile === constants.costProfiles.ECONOMIC) {

    }

    console.log(costs);
    return currentlyActivePolicy;
}

module.exports = {
    selectPolicy,
    selectPolicyForTransaction
};