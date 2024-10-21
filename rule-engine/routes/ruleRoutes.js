const express = require('express');
const router = express.Router();
const ruleController = require('../controllers/ruleControllers');

router.post('/create_rule', ruleController.createRule);
router.post('/evaluate_rule', ruleController.evaluateRule);
router.get('/get_rule',ruleController.getRule);

router.put('/update_rule/:id',ruleController.updateRule);

router.delete('/delete_rule/:id',ruleController.deleteRule);

module.exports = router;
