const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

router.get('/users', userController.getAllUsers);
router.get('/users/total-offers', userController.getTotalOffersCount);
router.get('/users/:id', userController.getUser);
router.post('/register', userController.register);
router.post('/login', userController.login);
router.post('/users/add-balance', userController.addBalance);
router.delete('/users/:id/remove-offer', userController.removeOneOffer);

module.exports = router;
