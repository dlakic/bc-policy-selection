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

module.exports = {
    blockchainTypes,
    intervals,
    blockchains,
};