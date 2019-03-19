const express = require('express');
const router = express.Router();
const policyController = require('../controller/policy-controller');
const loginController = require('../controller/login-controller');

/* GET home page. */
router.get('/', (req,res) => {
  res.render('login.html');
});

router.get('*', (req,res) => {
  res.redirect('/');
});

router.post('/form', loginController.handleLogin);
router.post('/api/policy', policyController.handlePolicy);
router.post('/api/save', policyController.savePolicy);

module.exports = router;
