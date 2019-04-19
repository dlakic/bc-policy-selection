function fetchForUser(username) {
    superagent
        .get('/policies/' + username)
        .end((err, res) => {
            if (err) {
                console.log(res);
                document.querySelector('#username-error').innerHTML = 'ERROR: ' + res.body.message;
                return document.querySelector('#username-error').style.display = 'block';
            } else {
                window.location.replace('/policies/' + username);
            }
        });
}
function submitUsername(id) {
    const username = document.querySelector(id).value;
    if (!username) {
        document.querySelector('#username-error').innerHTML = 'Please provide a username';
        return document.querySelector('#username-error').style.display = 'block';
    } else {
        document.querySelector('#username-error').style.display = 'none';
        fetchForUser(username);
    }
}

document.querySelector('#submit-username-form').addEventListener("click", function (e) {
    e.preventDefault();
    submitUsername('#username');
}, false);

function forwardToPolicyCreation(username) {
    superagent
        .get('/user-not-exist-check/' + username)
        .end((err, res) => {
            if (err) {
                console.log(res);
                document.querySelector('#username-error').innerHTML = 'ERROR: ' + res.body.message;
                return document.querySelector('#username-error').style.display = 'block';
            } else {
                window.location.replace('/policy?username=' + username);
            }
        });
}
function submitNewUsername(id) {
    const username = document.querySelector(id).value;
    if (!username) {
        document.querySelector('#username-error').innerHTML = 'Please provide a username';
        return document.querySelector('#username-error').style.display = 'block';
    } else {
        document.querySelector('#username-error').style.display = 'none';
        forwardToPolicyCreation(username);
    }
}

document.querySelector('#submit-new-username-form').addEventListener("click", function (e) {
    e.preventDefault();
    submitNewUsername('#username');
}, false);