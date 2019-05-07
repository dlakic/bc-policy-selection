function loadGraphs(resBody) {
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
        options: {}
    });

    const costsPerPolicyctx = document.getElementById('costsPerPolicyChart').getContext('2d');
    const policyIndexArray = resBody.policyStats.map((stat, index) => index + 1);
    const costArray = resBody.policyStats.map(stat => stat.cost);
    const costThresholdsArray = resBody.policyStats.map(stat => stat.costThreshold);

    new Chart(costsPerPolicyctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Max. Threshold',
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
        options: {}
    });
}

function getUserStats(username) {
    superagent
        .get('/user-stats/' + username)
        .end((err, res) => {
            if (err) {
                console.log(res);
            } else {
                loadGraphs(res.body);
            }
        });
}

document.addEventListener('DOMContentLoaded', function () {
    getUserStats(document.getElementById('username-stats').textContent)
});


