const express = require('express');
const authRoutes = require('./authRoutes');
const tourRoutes = require('./tourRoutes');
const bookingRoutes = require('./bookingRoutes');

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/tours', tourRoutes);
router.use('/bookings', bookingRoutes);

module.exports = router;
