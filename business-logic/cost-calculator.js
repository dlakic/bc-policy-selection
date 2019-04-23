const constants = require('../constants');
const ratesAPI = require('../api/bc-rates');
const bcCosts = require('../api/bc-fees');
const util = require('../util');
const transformUtil = require('../util/unit-transformations');

async function calculateCostForBlockchain(bcKey, blockchainRates, bytes, profile = 'low') {
    if (util.isTransactionFeeFreeBlockchain(bcKey)) {
        return {[bcKey]: 0};
    }
    if (bcKey === constants.blockchains.BTC.nameShort) {
        const costOne = await bcCosts.fetchBTCFeesInBTCPerByteBCFees();
        const costTwo = await bcCosts.fetchBTCFeesInBTCPerByteBlockCypher();
        const costInBTC = transformUtil.avgCost(costOne, costTwo);
        // convert to money
        const costs = {};
        Object.keys(costInBTC).map((profile) => {
            costs[profile] = costInBTC[profile] * blockchainRates[bcKey];
        });
        // cost per Byte
        return {[bcKey]: costs[profile]};
    }
    if (bcKey === constants.blockchains.ETH.nameShort) {
        const costOne = await bcCosts.fetchETHFeesPerGasBlockCypher();
        const costTwo = await bcCosts.fetchETHFeesPerGasEtherchain();
        const costInETH = transformUtil.avgCost(costOne, costTwo);
        // convert to money
        const costs = {};
        Object.keys(costInETH).map((profile) => {
            costs[profile] = costInETH[profile] * blockchainRates[bcKey] * constants.exchanges.GAS_PER_BYTE;
        });
        // cost per Byte
        return {[bcKey]: costs[profile]};
    }
    if (bcKey === constants.blockchains.XLM.nameShort) {
        // cost per operation
        return {[bcKey]: 0.00001 * blockchainRates[bcKey]};
    }
    if (bcKey === constants.blockchains.EOS.nameShort) {
        const ramCost = await bcCosts.fetchRAMPriceInEOS();
        // cost per Byte
        return {[bcKey]: ramCost * blockchainRates[bcKey]}
    }
    return {[bcKey]: 0};
}

async function calculateCosts(blockchainRates) {
    let blockchainCosts;
    const costs = {};
    Object.keys(blockchainRates).forEach(async bcKey => {
        blockchainCosts = await calculateCostForBlockchain(bcKey, blockchainRates, 0);
        costs[bcKey] = blockchainCosts[bcKey];
    });
    return costs;
}

async function calculateCostForPublicBlockchains(currency, publicBlockchainPool) {
    const publicBlockchains = publicBlockchainPool.map(blockchain => blockchain.nameShort);
    const publicBlockchainsString = publicBlockchains.join();
    const blockchainRates = await ratesAPI.fetchBlockchainCost(currency, publicBlockchainsString);
    return await calculateCosts(blockchainRates);
}

async function calculateCostForPrivateBlockchains(currency, privateBlockchainPool) {
    const blockchainRates = {};
    privateBlockchainPool.forEach((blockchain) => {
        blockchainRates[blockchain.nameShort] = 0;
    });
    return await calculateCosts(blockchainRates);
}

async function calculateCostForPolicy(policy, blockchainPool){
    const publicBlockchainPool = blockchainPool.filter(blockchain => blockchain.type === 'public');
    const privateBlockchainPool = blockchainPool.filter(blockchain => blockchain.type === 'private');
    let publicCosts = {};
    let privateCosts = {};
    if (publicBlockchainPool.length !== 0) {
        publicCosts = await calculateCostForPublicBlockchains(policy.currency, publicBlockchainPool);
    }

    if (privateBlockchainPool.length !== 0) {
        privateCosts = await calculateCostForPrivateBlockchains(policy.currency, privateBlockchainPool)
    }

    return {...publicCosts, ...privateCosts};
}

module.exports = {
    calculateCostForBlockchain,
    calculateCostForPolicy
};
