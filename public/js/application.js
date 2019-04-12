//TODO: Extract to appropriate njk template
let firstSubmit = true;
console.log(window.location);
if (window.location.pathname === '/policy' && window.location.search !== '') {
    document.querySelector('#more-info').style.display = 'block';
    firstSubmit = false;
}

function deletePolicy(id) {
    superagent
        .delete('/api/delete-policy/' + id)
        .set('accept', 'json')
        .end((err, res) => {
            if (err) {
                console.log(err);
            } else {
                window.location.replace("/");
            }
        });
}

const deletePolicyElements = document.querySelectorAll('.delete-button');
deletePolicyElements.forEach(function (element) {
    element.addEventListener("click", function () {
        deletePolicy(element.value);
    }, false);
});

function savePolicy(data) {
    superagent
        .post('/api/save-policy')
        .set('accept', 'json')
        .send(data)
        .end((err, res) => {
            if (err) {
                console.log(res);
                document.querySelector('#error').innerHTML = 'ERROR: ' + res.body.message;
                return document.querySelector('#error').style.display = 'block';
            } else {
                window.location.replace("/");
            }
        });
}

// TODO: validation and Errormessages
function submitPolicy(id) {
    const form = document.querySelector(id);
    const jsonFormData = toJSON(form);
    if (!jsonFormData.username) {
        document.querySelector('#error').innerHTML = 'ERROR: Please Provide a username';
        return document.querySelector('#error').style.display = 'block';
    } else {
        document.querySelector('#error').style.display = 'none';
    }
    if (jsonFormData.preferredBC && jsonFormData.preferredBC.length !== 1) {
        document.querySelector('#more-info').style.display = 'block';
        if (!firstSubmit) {
            savePolicy(jsonFormData);
        }
        firstSubmit = false;
    } else {
        savePolicy(jsonFormData);
    }
}


document.querySelector('#submit-policy-form').addEventListener("click", function (e) {
    e.preventDefault();
    submitPolicy('#policy-form');
}, false);


function toJSON(form) {
    const obj = {};
    const elements = form.querySelectorAll("input, select, textarea");
    for (let i = 0; i < elements.length; ++i) {
        let element = elements[i];
        let name = element.name;
        let value;
        if (element.multiple) {
            value = [];
            let opt;
            let options = element.options;
            for (var j = 0; j < options.length; j++) {
                opt = options[j];
                if (opt.selected) {
                    value.push(opt.value || opt.text);
                }
            }
        } else {
            value = element.value;
        }
        if (name) {
            obj[name] = value;
        }
    }

    return obj;
}

