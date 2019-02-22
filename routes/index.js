const express = require('express');
const router = express.Router();
const policyController = require('../controller/policy-controller');

/* GET home page. */
router.get('/', (req,res) => {
  res.render('index.html');
});
router.get('/api/policy', policyController.handlePolicy);

module.exports = router;
