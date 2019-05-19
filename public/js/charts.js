function loadGraphs(resBody) {
    const chartoptions = {animation: false};
    const costsPerIntervalctx = document.getElementById('costsPerIntervalChart').getContext('2d');
    new Chart(costsPerIntervalctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Max. Threshold',
                    backgroundColor: 'rgb(255, 56, 96, 0)',
                    borderColor: 'rgb(255, 56, 96)',
                    data: [
                        resBody.maxDailyCostThreshold,
                        resBody.maxWeeklyCostThreshold,
                        resBody.maxMonthlyCostThreshold,
                        resBody.maxYearlyCostThreshold,
                    ],
                    steppedLine: 'middle',
                    scaleOptions: {
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    // Changes this dataset to become a line
                    type: 'line'
                },
                {
                    label: 'Accumulated cost',
                    backgroundColor: 'rgb(32,156,238)',
                    borderColor: 'rgb(32,156,238)',
                    data: [
                        resBody.costDaily,
                        resBody.costWeekly,
                        resBody.costMonthly,
                        resBody.costYearly,
                    ]
                },
            ],
            labels: ['daily', 'weekly', 'monthly', 'yearly'],
        },
        options: chartoptions,
    });

    const costsPerPolicyctx = document.getElementById('costsPerPolicyChart').getContext('2d');
    const policyIndexArray = resBody.policyStats.map(function (stat, index) {
        return index + 1
    });
    const costArray = resBody.policyStats.map(function (stat) {
        return stat.cost
    });
    const costThresholdsArray = resBody.policyStats.map(function (stat) {
        return stat.costThreshold
    });

    new Chart(costsPerPolicyctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Cost Threshold',
                    backgroundColor: 'rgb(255, 56, 96, 0)',
                    borderColor: 'rgb(255, 56, 96)',
                    data: costThresholdsArray,
                    steppedLine: 'middle',
                    scaleOptions: {
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    // Changes this dataset to become a line
                    type: 'line'
                },
                {
                    label: 'Cost per Policy',
                    backgroundColor: 'rgb(32,156,238)',
                    borderColor: 'rgb(32,156,238)',
                    data: costArray,
                },
            ],
            labels: policyIndexArray,
        },
        options: chartoptions
    });

    const transactionstPerPolicyctx = document.getElementById('transactionsPerPolicyChart').getContext('2d');
    const transactionsArray = resBody.policyStats.map(function (stat) {
        return stat.transactions
    });

    new Chart(transactionstPerPolicyctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Transactions per Policy',
                    backgroundColor: 'rgb(32,156,238)',
                    borderColor: 'rgb(32,156,238)',
                    data: transactionsArray,
                },
            ],
            labels: policyIndexArray,
        },
        options: chartoptions
    });

    const transactionstPerBlockchainctx = document.getElementById('transactionsPerBlockchainChart').getContext('2d');
    const blockchainArray = resBody.blockchainStats.map(function (stat) {
        return stat.nameShort
    });
    const economicArray = resBody.blockchainStats.map(function (stat) {
        return stat.economicTransactions
    });
    const performanceArray = resBody.blockchainStats.map(function (stat) {
        return stat.performanceTransactions
    });

    new Chart(transactionstPerBlockchainctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Performance',
                    backgroundColor: 'rgb(255, 56, 96)',
                    borderColor: 'rgb(255, 56, 96)',
                    data: performanceArray,
                },
                {
                    label: 'Economic',
                    backgroundColor: 'rgb(32,156,238)',
                    borderColor: 'rgb(32,156,238)',
                    data: economicArray,
                },
            ],
            labels: blockchainArray,
        },
        options: {
            scales: {
                xAxes: [{stacked: true}],
                yAxes: [{stacked: true}]
            },
            animation: false,
        }
    });

    const blockchainsPerIntervalctx = document.getElementById('blockchainsPerIntervalChart').getContext('2d');
    const intervalArray = resBody.intervalStats.map(function (stat) {
        return stat.interval
    });
    const btcArray = resBody.intervalStats.map(function (stat) {
        return stat.BTC
    });
    const ethArray = resBody.intervalStats.map(function (stat) {
        return stat.ETH
    });
    const xlmArray = resBody.intervalStats.map(function (stat) {
        return stat.XLM
    });
    const eosArray = resBody.intervalStats.map(function (stat) {
        return stat.EOS
    });
    const miotaArray = resBody.intervalStats.map(function (stat) {
        return stat.MIOTA
    });
    const hypArray = resBody.intervalStats.map(function (stat) {
        return stat.HYP
    });
    const mlcArray = resBody.intervalStats.map(function (stat) {
        return stat.MLC
    });
    const psgArray = resBody.intervalStats.map(function (stat) {
        return stat.PSG
    });

    new Chart(blockchainsPerIntervalctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'BTC',
                    backgroundColor: 'rgb(255, 56, 96)',
                    borderColor: 'rgb(255, 56, 96)',
                    data: btcArray,
                },
                {
                    label: 'ETH',
                    backgroundColor: 'rgb(32,156,238)',
                    borderColor: 'rgb(32,156,238)',
                    data: ethArray,
                },
                {
                    label: 'XLM',
                    backgroundColor: 'rgb(255, 200, 0)',
                    borderColor: 'rgb(255, 200, 0)',
                    data: xlmArray,
                },
                {
                    label: 'EOS',
                    backgroundColor: 'rgb(255,58,235)',
                    borderColor: 'rgb(255,58,235)',
                    data: eosArray,
                },
                {
                    label: 'MIOTA',
                    backgroundColor: 'rgb(148, 24, 24)',
                    borderColor: 'rgb(148, 24, 24)',
                    data: miotaArray,
                },
                {
                    label: 'HYP',
                    backgroundColor: 'rgb(0,55,255)',
                    borderColor: 'rgb(0,55,255)',
                    data: hypArray,
                },
                {
                    label: 'MLC',
                    backgroundColor: 'rgb(24, 148, 148)',
                    borderColor: 'rgb(24, 148, 148)',
                    data: mlcArray,
                },
                {
                    label: 'PSG',
                    backgroundColor: 'rgb(58,255,78)',
                    borderColor: 'rgb(58,255,78)',
                    data: psgArray,
                },
            ],
            labels: intervalArray,
        },
        options: {
            scales: {
                xAxes: [{stacked: true}],
                yAxes: [{stacked: true}]
            },
            animation: false,
        }
    });
}

function getUserStats(username) {
    superagent
        .get('/user-stats/' + username)
        .end(function (err, res) {
            if (err) {
                console.log(res);
            } else {
                loadGraphs(res.body);
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {
    getUserStats(document.getElementById('username-stats').textContent);
    setInterval(function () {
        getUserStats(document.getElementById('username-stats').textContent);
    }, 5000);
});


