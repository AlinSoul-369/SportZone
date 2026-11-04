const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');

router.get('/carts', cartController.getCarts);
router.get('/carts/monthly-earnings', cartController.getMonthlyEarnings);
router.get('/carts/current-year-earnings', cartController.getCurrentYearEarnings);
router.get('/carts/:id', cartController.getCarts);
router.post('/carts', cartController.createCart);

module.exports = router;
