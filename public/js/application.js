function deletePolicy (id) {
    console.log('hehe');
    superagent
        .delete('/api/delete-policy/' + id)
        .set('accept', 'json')
        .end((err, res) => {
            if(err) {
                console.log(err);
            } else {
                console.log(res);
                window.location.replace("/");
            }
        });
}

var deletePolicyElements =  document.querySelectorAll('.delete-button');
deletePolicyElements.forEach(function (element) {
    element.addEventListener("click", function() {
        deletePolicy(element.value);
    }, false);
});
