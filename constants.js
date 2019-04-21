const blockchainTypes = {
    PUBLIC: 'public',
    PRIVATE: 'private',
    BOTH: 'both',
};

const intervals = {
    DEFAULT: 'default',
    DAILY: 'daily',
    WEEKLY: 'weekly',
    MONTHLY: 'monthly',
    YEARLY: 'yearly'
};

const blockchains = {
    BTC: {
        name: 'Bitcoin',
        nameShort: 'BTC',
        type: 'public'
    },
    ETH: {
        name: 'Ethereum',
        nameShort: 'ETH',
        type: 'public'
    },
    XLM: {
        name: 'Stellar',
        nameShort: 'XLM',
        type: 'public'
    },
    EOS: {
        name: 'EOS',
        nameShort: 'EOS',
        type: 'public'
    },
    MIOTA: {
        name: 'IOTA',
        nameShort: 'MIOTA',
        type: 'public'
    },
    HYP: {
        name: 'Hyperledger',
        nameShort: 'HYP',
        type: 'private'
    },
    MLC: {
        name: 'Multichain',
        nameShort: 'MLC',
        type: 'private'
    },
    PSG: {
        name: 'Postgres(No Blockchain)',
        nameShort: 'PSG',
        type: 'private'
    },
};

const exchanges = {
    WEI_TO_ETH: 1000000000000000000,
    GWEI_TO_ETH: 1000000000,
    SATOSHIS_TO_BTC: 100000000,
    BYTE_TO_KBYTE: 1024,
};

module.exports = {
    blockchainTypes,
    intervals,
    blockchains,
    exchanges
};