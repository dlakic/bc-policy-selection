function deletePolicy(id) {
    superagent
        .delete('/api/delete-policy/' + id)
        .set('accept', 'json')
        .end((err, res) => {
            if (err) {
                console.log(err);
            } else {
                console.log(res);
                window.location.replace("/policies/" + res.body.username);
            }
        });
}

const deletePolicyElements = document.querySelectorAll('.delete-button');
deletePolicyElements.forEach(function (element) {
    element.addEventListener("click", function () {
        deletePolicy(element.value);
    }, false);
});

const ctx = document.getElementById('costChart').getContext('2d');
var chart = new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
        labels: ['daily', 'weekly', 'monthly', 'monthly'],
        datasets: [{
            label: 'Accumulated costs',
            backgroundColor: 'rgb(32,156,238)',
            borderColor: 'rgb(32,156,238)',
            data: [
                parseFloat(document.getElementById('dailyCost').textContent),
                parseFloat(document.getElementById('weeklyCost').textContent),
                parseFloat(document.getElementById('monthlyCost').textContent),
                parseFloat(document.getElementById('yearlyCost').textContent),

            ]
        }]
    },

    // Configuration options go here
    options: {}
});