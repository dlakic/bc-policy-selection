// TODO: implement Proper Login
let PolicyModel = require('../models/policy');
module.exports.handleLogin = (req, res) => {
    const username = req.body.username;

    PolicyModel.findOne({'username': username})
        .then(queriedPolicy => {
            if (queriedPolicy) {
                return res.status(200).render('index', {policy : queriedPolicy});
            } else {
                const policy = {
                    username: username,
                    preferredBC: [],
                    currency: '',
                    cost: '',
                    bcType: '',

                };
                return res.status(200).render('index', {policy : policy});
            }
        })
        .catch(err => {
            console.error(err);
            res.status(500).render('error', err)
        });

};
