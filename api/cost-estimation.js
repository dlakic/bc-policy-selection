const request = require('request-promise');

module.exports.fetchBlockchainCost = (currency) => {
    const options = {
        uri: 'https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest',
        qs: {
            symbol: 'BTC,ETH',
            convert: currency
        },
        headers: {
            'X-CMC_PRO_API_KEY': process.env.COINMARKETCAP_API_KEY
        },
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            resolve({BTC: response.data.BTC.quote[currency].price, ETH: response.data.ETH.quote[currency].price});
        }).catch((err) => {
            reject(err);
        });
    })
};
