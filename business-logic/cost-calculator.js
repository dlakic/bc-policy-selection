const constants = require('../constants');
const ratesAPI = require('../api/bc-rates');

async function calculateCosts(blockchainRates) {
    const costs = {};
    Object.keys(blockchainRates).forEach(bcKey => {
        if(bcKey === constants.blockchains.BTC.nameShort) {
            //TODO: calculate for BTC
        }
        if(bcKey === constants.blockchains.ETH.nameShort) {
            //TODO: calculate for ETH
        }
        if(bcKey === constants.blockchains.XLM.nameShort) {
            //TODO: calculate for XLM
        }
        if(bcKey === constants.blockchains.EOS.nameShort) {
            //TODO: calculate for EOS
        }
        if(bcKey === constants.blockchains.MIOTA.nameShort) {
            //TODO: calculate for MIOTA
        }
    });
    return costs;
}

async function calculateCostForPublicBlockchains(currency, publicBlockchainPool) {
    const publicBlockchains = publicBlockchainPool.map(blockchain => blockchain.nameShort);
    const publicBlockchainsString = publicBlockchains.join();
    const blockchainRates = await ratesAPI.fetchBlockchainCost(currency, publicBlockchainsString);
    return await calculateCosts(blockchainRates);
}



module.exports.calculateCostForPolicy = async (policy, blockchainPool) => {
    const publicBlockchainPool = blockchainPool.filter(blockchain => blockchain.type === 'public');
    const privateBlockchainPool = blockchainPool.filter(blockchain => blockchain.type === 'private');
    if(publicBlockchainPool.length !== 0) {
        return await calculateCostForPublicBlockchains(policy.currency, publicBlockchainPool);
    }

    if(privateBlockchainPool.length !== 0) {
        //TODO: calculate for private bcs
    }

    //TODO: return lowest
    return blockchainPool;
};
