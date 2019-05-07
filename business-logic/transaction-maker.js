const TransactionRepository = require('../repositories/transaction-repository');
const policySelector = require('./policy-selector');
const blockchainSelector = require('./blockchain-selector');
const ratesAPI = require('../api/bc-rates');
const costCalculator = require('./cost-calculator');
const userCostUpdater = require('./user-cost-updater');
const constants = require('../constants');
const util = require('../util');

async function getAllBlockchainCostsPerByte() {
    // TODO: Switch back to API for prod
    //const publicBlockchainsString = util.publicBlockchainsForCostRequest();
    //const blockchainRates = await ratesAPI.fetchBlockchainCost(currentlyActivePolicy.currency, publicBlockchainsString);
    const publicBlockchainRates = await ratesAPI.fetchBlockchainCostNOAPI();
    const allBlockchainRates = util.addPrivateRatesToObject(publicBlockchainRates);
    return await costCalculator.calculateCosts(allBlockchainRates);
}

function getCostsForSheets(costsPerByte, violationData) {
    const costs = [];
    violationData.violations.map((sheetData) => {
        const costsForSheet = costCalculator.multiplyWithBytes(costsPerByte, sheetData.sizeString);
        costs.push(costsForSheet);
    });
    return costs;
}

async function makeTransactions(policies, user, violationData) {
    const costsPerByte = await getAllBlockchainCostsPerByte();
    let sheetCosts = getCostsForSheets(costsPerByte, violationData);
    let currentlyActivePolicy;
    let viableBlockchains;

    let transactionInfo = [];
    for (let [index, cost] of sheetCosts.entries()) {
        currentlyActivePolicy = await policySelector.selectPolicy(policies, user);
        viableBlockchains = await blockchainSelector.selectBlockchainFromPolicy(currentlyActivePolicy);
        const chosenBlockchainKey = await blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy, cost, viableBlockchains);
        await userCostUpdater.addToUserCosts(user, cost[chosenBlockchainKey]);
        const transaction = {
            username: user.username,
            blockchain: constants.blockchains[chosenBlockchainKey].name,
            data: violationData.violations[index].dataString,
            cost: cost[chosenBlockchainKey],
            policyId: currentlyActivePolicy._id,
        };
        await TransactionRepository.createTransaction(transaction);
        transactionInfo.push(transaction)
    }
    return transactionInfo;
}

module.exports = {
    makeTransactions
};