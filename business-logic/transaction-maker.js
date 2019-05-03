const policySelector = require('./policy-selector');
const blockchainSelector = require('./blockchain-selector');
const ratesAPI = require('../api/bc-rates');
const costCalculator = require('./cost-calculator');
const userCostUpdater = require('./user-cost-updater');
const constants = require('../constants');

async function makeTransactions(policies, user, violationData) {
    const currentlyActivePolicy = await policySelector.selectPolicy(policies, user);
    const viableBlockchains = await blockchainSelector.selectBlockchainFromPolicy(currentlyActivePolicy);
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
    const chosenBlockchainKey = blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy,totalCosts,viableBlockchains);
        // TODO: Put call to API here
    userCostUpdater.addToUserCosts(user, totalCosts[chosenBlockchainKey]);

    return {blockchain: constants.blockchains[chosenBlockchainKey], data: violationData};
}

module.exports = {
    makeTransactions
};