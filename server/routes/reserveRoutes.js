const express = require('express');
const router = express.Router();
const reserveController = require('../controllers/reserveController');




router.get('/reserves/available-slots', reserveController.getAvailableSlots);


router.get('/reserves/user/:userId', reserveController.getReservesByUser);


router.get('/reserves', reserveController.getAllReserves);
router.get('/reserves/:id', reserveController.getReservesById);


router.post('/reserves', reserveController.createReserve);

module.exports = router;