const policySelector = require('./policy-selector');
const blockchainSelector = require('./blockchain-selector');
const ratesAPI = require('../api/bc-rates');
const costCalculator = require('./cost-calculator');
const userCostUpdater = require('./user-cost-updater');
const constants = require('../constants');

async function makeTransactions(policies, user, violationData) {
    const currentlyActivePolicy = await policySelector.selectPolicy(policies, user);
    const viableBlockchains = await blockchainSelector.selectBlockchain(currentlyActivePolicy);
    // TODO: Switch back to API for prod
    //const publicBlockchainsString = util.publicBlockchainsForCostRequest();
    //const blockchainRates = await ratesAPI.fetchBlockchainCost(currentlyActivePolicy.currency, publicBlockchainsString);
    const blockchainRates = await ratesAPI.fetchBlockchainCostNOAPI();
    const viableBlockchainRates = {};
    viableBlockchains.forEach((viableBlockchain) => {
        viableBlockchainRates[viableBlockchain.nameShort] = blockchainRates[viableBlockchain.nameShort];
    });
    const costsPerByte = await costCalculator.calculateCosts(viableBlockchainRates);
    const costs = [];
    await Promise.all(
        violationData.violations.map(async (sheetData) => {
            const costsForSheet = costCalculator.multiplyWithBytes(costsPerByte, sheetData.sizeString);
            costs.push(costsForSheet);
        })
    );

    const totalCosts = {...costs[0]};
    costs.forEach((cost, index) => {
        if (index !== 0) {
            Object.keys(cost).forEach((bcKey) => {
                totalCosts[bcKey] = totalCosts[bcKey] + cost[bcKey]
            })
        }
    });

    if (currentlyActivePolicy.costProfile === constants.costProfiles.PERFORMANCE) {
        //TODO: use most performant
    } else {
        const minCostBCKey = Object.keys(totalCosts).reduce((a, b) => {
            return totalCosts[a] < totalCosts[b] ? a : b
        });
        console.log(minCostBCKey + totalCosts[minCostBCKey]);
        // TODO: make actual call
        userCostUpdater.addToUserCosts(user, totalCosts[minCostBCKey]);
    }
    return currentlyActivePolicy;
}

module.exports = {
    makeTransactions
};