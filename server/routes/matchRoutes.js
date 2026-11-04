const express = require('express');
const router = express.Router();
const matchController = require('../controllers/matchController');

router.get('/matches', matchController.getMatches);
router.post('/matches', matchController.createMatch);
router.put('/matches/:id', matchController.updateMatch);
router.delete('/matches/:id', matchController.deleteMatch);
router.put('/matches/:id/apply', matchController.applyMatchResult);
router.get('/matches/:id/correct-predictors', matchController.getCorrectPredictors);

module.exports = router;
