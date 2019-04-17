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
