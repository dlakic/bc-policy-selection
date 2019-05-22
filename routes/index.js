const express = require('express');
const router = express.Router();
const multer  = require('multer');
const policyController = require('../controller/policy-controller');
const transactionController = require('../controller/transaction-controller');
const userController = require('../controller/user-controller');

const upload = multer();

/* GET home page. */
router.get('/', (req, res) => res.status(200).render('index'));
router.get('/policies/:username', policyController.listPolicies);
router.get('/blockchains', policyController.listBlockchains);
router.get('/policy', policyController.editPolicy);
router.get('/api/user-not-exist-check/:username', userController.checkIfUserDoesNotExist);
router.get('/api/blockchain-cost/:blockchain/:currency', transactionController.getBlockchainCost);
router.get('/api/user-stats/:username', userController.getUserStats);
router.get('*', (req, res) => {
    res.redirect('/');
});

router.post('/api/save-policy', policyController.savePolicy);
router.delete('/api/delete-policy/:id', policyController.deletePolicy);
router.post('/api/create-transactions', upload.single('xlsxFile'), transactionController.handleTransaction);

module.exports = router;
