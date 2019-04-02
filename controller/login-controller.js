// TODO: implement Proper Login
let PolicyModel = require('../models/policy');
module.exports.handleLogin = (req, res) => {

    PolicyModel.findOne({'_id': req.param.id})
        .then(queriedPolicy => {
            if (queriedPolicy) {
                return res.status(200).render('index', {policy : queriedPolicy});
            } else {
                const policy = {
                    username: '',
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
