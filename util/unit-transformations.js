const {WEI_TO_ETH, GWEI_TO_ETH, SATOSHIS_TO_BTC, BYTE_TO_KBYTE} = require('../constants').exchanges;

function weiToGwei(wei) {
    return wei * WEI_TO_ETH;
}

function gweiToWei(gwei) {
    return gwei / GWEI_TO_ETH
}

function weiToEth(wei) {
    return wei / WEI_TO_ETH
}

function ethToWei(eth) {
    return eth * WEI_TO_ETH
}

function satoshisToBtc(sat) {
    return sat / SATOSHIS_TO_BTC
}

function kbyteToByte(kbyte) {
    return kbyte / BYTE_TO_KBYTE
}

function avgCost(costOne, costTwo) {
    return {
        high: (costOne.high + costTwo.high) / 2,
        medium: (costOne.medium + costTwo.medium) / 2,
        low: (costOne.low + costTwo.low) / 2
    };
}

module.exports = {
    weiToGwei,
    gweiToWei,
    weiToEth,
    ethToWei,
    satoshisToBtc,
    kbyteToByte,
    avgCost
};