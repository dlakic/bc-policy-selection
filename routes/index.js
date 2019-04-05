const express = require('express');
const router = express.Router();
const policyController = require('../controller/policy-controller');
const transactionController = require('../controller/transaction-controller');

/* GET home page. */

router.get('/', policyController.listPolicies);
router.get('/blockchains', policyController.listBlockchains);
router.get('/policy', policyController.editPolicy);

router.get('*', (req,res) => {
  res.redirect('/');
});

router.post('/api/save-policy', policyController.savePolicy);
router.post('/api/create-transaction', transactionController.handleTransaction);

module.exports = router;
