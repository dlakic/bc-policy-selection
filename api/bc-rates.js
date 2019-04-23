const request = require('request-promise');

module.exports.fetchBlockchainCost = (currency, blockchains) => {
    const options = {
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
            symbol: blockchains,
            convert: currency
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        },
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            const cleanedResponse = {};
            Object.keys(response.data).forEach(bcKey => {
                cleanedResponse[bcKey] = response.data[bcKey].quote[currency].price;
            });
            resolve(cleanedResponse);
        }).catch((err) => {
            reject(err);
        });
    })
};
