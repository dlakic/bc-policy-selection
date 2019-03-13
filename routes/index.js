const express = require('express');
const router = express.Router();
const policyController = require('../controller/policy-controller');

/* GET home page. */
router.get('/', (req,res) => {
  res.render('index.html');
});
router.post('/api/policy', policyController.handlePolicy);
router.post('/api/show', policyController.showPolicy);

module.exports = router;
