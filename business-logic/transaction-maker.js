const TransactionRepository = require('../repositories/transaction-repository');
const policySelector = require('./policy-selector');
const blockchainSelector = require('./blockchain-selector');
const ratesAPI = require('../api/bc-rates');
const costCalculator = require('./cost-calculator');
const userCostUpdater = require('./user-cost-updater');
const constants = require('../constants');
const util = require('../util');

async function getAllBlockchainCostsPerByte(currency) {
    // TODO: Switch back to API for prod
    //const publicBlockchainsString = util.publicBlockchainsForCostRequest();
    //const publicBlockchainRates = await ratesAPI.fetchBlockchainCost(currency, publicBlockchainsString);
    const publicBlockchainRates = await ratesAPI.fetchBlockchainCostNOAPI(currency);
    const allBlockchainRates = util.addPrivateRatesToObject(publicBlockchainRates);
    return await costCalculator.calculateCosts(allBlockchainRates);
}

function getCostsForData(costsPerByte, data) {
    const costs = [];

    if (data.violations) {
        data.violations.map((sheetData) => {
            const costsForSheet = costCalculator.multiplyWithBytes(costsPerByte, sheetData.sizeString);
            costs.push(costsForSheet);
        });
        return costs;
    }

    const costsForTrxHash = costCalculator.multiplyWithBytes(costsPerByte, data.sizeString);
    costs.push(costsForTrxHash);
    return costs;

}

async function makeTransactions(policies, user, violationData) {
    const costsPerByte = await getAllBlockchainCostsPerByte(user.currency);
    let sheetCosts = getCostsForData(costsPerByte, violationData);
    let currentlyActivePolicy;
    let previouslyActivePolicy;
    let viableBlockchains;
    let alreadyUsedBlockchainIndex = 0;
    const transactionInfo = [];
    let alreadyUsedBlockchains = [];
    for (let [index, cost] of sheetCosts.entries()) {
        currentlyActivePolicy = await policySelector.selectPolicy(policies, user);
        viableBlockchains = await blockchainSelector.selectBlockchainFromPolicy(currentlyActivePolicy);
        let chosenBlockchainKey = await blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy, cost, viableBlockchains, alreadyUsedBlockchains, alreadyUsedBlockchainIndex);
        if (currentlyActivePolicy['split']) {
            if (previouslyActivePolicy && !previouslyActivePolicy._id.equals(currentlyActivePolicy._id)) {
                alreadyUsedBlockchains = [];
                alreadyUsedBlockchainIndex = 0;
            }
            chosenBlockchainKey = await blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy, cost, viableBlockchains, alreadyUsedBlockchains, alreadyUsedBlockchainIndex);
            if (alreadyUsedBlockchainIndex >= alreadyUsedBlockchains.length - 1) {
                alreadyUsedBlockchainIndex = 0;
            } else if (alreadyUsedBlockchains.length === viableBlockchains.length) {
                alreadyUsedBlockchainIndex = alreadyUsedBlockchainIndex + 1;
            }
            if (!alreadyUsedBlockchains.includes(chosenBlockchainKey)) {
                alreadyUsedBlockchains.push(chosenBlockchainKey);
            }
        } else {
            chosenBlockchainKey = await blockchainSelector.selectBlockchainForTransaction(currentlyActivePolicy, cost, viableBlockchains, alreadyUsedBlockchains, alreadyUsedBlockchainIndex);
        }

        await userCostUpdater.addToUserCosts(user, cost[chosenBlockchainKey]);
        const data = violationData.violations ? violationData.violations[index].dataString : '';
        const dataHash = violationData.violations ? violationData.violations[index].dataHash : violationData.dataHash;
        const transaction = {
            username: user.username,
            blockchain: constants.blockchains[chosenBlockchainKey].name,
            dataHash,
            data,
            cost: cost[chosenBlockchainKey],
            policyId: currentlyActivePolicy._id,
            costProfile: currentlyActivePolicy.costProfile,
            interval: currentlyActivePolicy.interval
        };
        await TransactionRepository.createTransaction(transaction);
        transactionInfo.push(transaction);
        previouslyActivePolicy = currentlyActivePolicy;
    }
    return transactionInfo;
}

module.exports = {
    makeTransactions
};