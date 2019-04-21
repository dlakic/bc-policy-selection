const request = require('request-promise');
const transformUtils = require('../util/unit-transformations');

module.exports.fetchBTCFeesInSatoshiPerByteBCFees = () => {
    const options = {
        uri: 'https://bitcoinfees.earn.com/api/v1/fees/recommended',
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            resolve({
                high: response.fastestFee,
                medium: response.halfHourFee,
                low: response.hourFee,
            });
        }).catch((err) => {
            reject(err);
        });
    })
};

//This API returns data per kbyte, hence the transformation
module.exports.fetchBTCFeesInSatoshiPerByteBlockCypher = () => {
    const options = {
        uri: 'https://api.blockcypher.com/v1/btc/main',
        json: true
    };
    return new Promise((resolve, reject) => {
        request(options).then((response) => {
            resolve({
                high: transformUtils.kbyteToByte(response.high_fee_per_kb),
                medium: transformUtils.kbyteToByte(response.medium_fee_per_kb),
                low: transformUtils.kbyteToByte(response.low_fee_per_kb),
            });
        }).catch((err) => {
            reject(err);
        });
    })
};
