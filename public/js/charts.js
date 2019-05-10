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


