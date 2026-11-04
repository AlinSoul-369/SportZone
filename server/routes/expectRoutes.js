const express = require('express');
const router = express.Router();
const expectController = require('../controllers/expectController');

router.get('/expects', expectController.getAllExpects);
router.post('/expects', expectController.createExpect);

module.exports = router;
