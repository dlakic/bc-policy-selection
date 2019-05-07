function loadGraphs(resBody) {
    console.log(resBody);
    const ctx = document.getElementById('costChart').getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            datasets: [
                {
                    label: 'Max. Limits',
                    backgroundColor: 'rgb(255, 56, 96, 0.3)',
                    borderColor: 'rgb(255, 56, 96, 0.5)',
                    data: [
                        resBody.maxDailyCostThreshold,
                        resBody.maxWeeklyCostThreshold,
                        resBody.maxMonthlyCostThreshold,
                        resBody.maxYearlyCostThreshold,
                        resBody.maxYearlyCostThreshold,
                    ],
                    steppedLine: 'before',
                    scaleOptions: {
                        ticks: {
                            beginAtZero: true
                        }
                    },
                    // Changes this dataset to become a line
                    type: 'line'
                }, {
                    label: 'Accumulated costs',
                    backgroundColor: 'rgb(32,156,238)',
                    borderColor: 'rgb(32,156,238)',
                    data: [
                        parseFloat(document.getElementById('dailyCost').textContent),
                        parseFloat(document.getElementById('weeklyCost').textContent),
                        parseFloat(document.getElementById('monthlyCost').textContent),
                        parseFloat(document.getElementById('yearlyCost').textContent),
                    ]
                },
            ],
            labels: ['daily', 'weekly', 'monthly', 'monthly'],
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


