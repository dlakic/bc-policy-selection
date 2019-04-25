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

//TODO: REmove this from PRod
module.exports.fetchBlockchainCostNOAPI = () => {
    const data = {
        "status": {
            "timestamp": "2019-04-25T12:53:07.672Z",
            "error_code": 0,
            "error_message": null,
            "elapsed": 8,
            "credit_count": 1
        },
        "data": {
            "BTC": {
                "id": 1,
                "name": "Bitcoin",
                "symbol": "BTC",
                "slug": "bitcoin",
                "circulating_supply": 17664662,
                "total_supply": 17664662,
                "max_supply": 21000000,
                "date_added": "2013-04-28T00:00:00.000Z",
                "num_market_pairs": 7323,
                "tags": [
                    "mineable"
                ],
                "platform": null,
                "cmc_rank": 1,
                "last_updated": "2019-04-25T12:52:28.000Z",
                "quote": {
                    "CHF": {
                        "price": 5608.123613433238,
                        "volume_24h": 14676386881.363943,
                        "percent_change_1h": 0.1267,
                        "percent_change_24h": 0.2324,
                        "percent_change_7d": 4.0439,
                        "market_cap": 99065608085.5168,
                        "last_updated": "2019-04-25T12:52:00.000Z"
                    }
                }
            },
            "EOS": {
                "id": 1765,
                "name": "EOS",
                "symbol": "EOS",
                "slug": "eos",
                "circulating_supply": 943105138.7775,
                "total_supply": 1043105142.4366,
                "max_supply": null,
                "date_added": "2017-07-01T00:00:00.000Z",
                "num_market_pairs": 301,
                "tags": [],
                "platform": null,
                "cmc_rank": 6,
                "last_updated": "2019-04-25T12:52:05.000Z",
                "quote": {
                    "CHF": {
                        "price": 4.891320832981789,
                        "volume_24h": 2526760721.9240637,
                        "percent_change_1h": -0.5312,
                        "percent_change_24h": -1.6101,
                        "percent_change_7d": -12.7689,
                        "market_cap": 4613029812.994566,
                        "last_updated": "2019-04-25T12:52:00.000Z"
                    }
                }
            },
            "ETH": {
                "id": 1027,
                "name": "Ethereum",
                "symbol": "ETH",
                "slug": "ethereum",
                "circulating_supply": 105804935.4991,
                "total_supply": 105804935.4991,
                "max_supply": null,
                "date_added": "2015-08-07T00:00:00.000Z",
                "num_market_pairs": 5218,
                "tags": [
                    "mineable"
                ],
                "platform": null,
                "cmc_rank": 2,
                "last_updated": "2019-04-25T12:52:21.000Z",
                "quote": {
                    "CHF": {
                        "price": 168.1889978222549,
                        "volume_24h": 6472533531.251046,
                        "percent_change_1h": 0.0119,
                        "percent_change_24h": -0.4808,
                        "percent_change_7d": -4.4237,
                        "market_cap": 17795226066.241947,
                        "last_updated": "2019-04-25T12:52:00.000Z"
                    }
                }
            },
            "MIOTA": {
                "id": 1720,
                "name": "IOTA",
                "symbol": "MIOTA",
                "slug": "iota",
                "circulating_supply": 2779530283,
                "total_supply": 2779530283,
                "max_supply": 2779530283,
                "date_added": "2017-06-13T00:00:00.000Z",
                "num_market_pairs": 37,
                "tags": [],
                "platform": null,
                "cmc_rank": 16,
                "last_updated": "2019-04-25T12:52:03.000Z",
                "quote": {
                    "CHF": {
                        "price": 0.2883197499514367,
                        "volume_24h": 11653676.857190026,
                        "percent_change_1h": 0.6151,
                        "percent_change_24h": -1.4449,
                        "percent_change_7d": -9.4096,
                        "market_cap": 801393476.1770062,
                        "last_updated": "2019-04-25T12:52:00.000Z"
                    }
                }
            },
            "XLM": {
                "id": 512,
                "name": "Stellar",
                "symbol": "XLM",
                "slug": "stellar",
                "circulating_supply": 19405184688.4197,
                "total_supply": 104922376416.237,
                "max_supply": null,
                "date_added": "2014-08-05T00:00:00.000Z",
                "num_market_pairs": 243,
                "tags": [],
                "platform": null,
                "cmc_rank": 9,
                "last_updated": "2019-04-25T12:52:02.000Z",
                "quote": {
                    "CHF": {
                        "price": 0.1065715011218709,
                        "volume_24h": 247174377.3471014,
                        "percent_change_1h": -0.0132,
                        "percent_change_24h": 0.0563,
                        "percent_change_7d": -10.9554,
                        "market_cap": 2068039661.7920322,
                        "last_updated": "2019-04-25T12:52:00.000Z"
                    }
                }
            }
        }
    };
    const cleanedData = {};
    Object.keys(data.data).forEach(bcKey => {
        cleanedData[bcKey] = data.data[bcKey].quote['CHF'].price;
    });
    return cleanedData
};