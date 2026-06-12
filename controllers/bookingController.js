const { db } = require('../config/firebase');

/**
 * @desc    Create a new booking for a tour
 * @route   POST /api/bookings
 * @access  Private
 */
const createBooking = async (req, res, next) => {
  try {
    const { tourId, tourName, price, dates, bookingId, image } = req.body;

    if (!tourId || !tourName || price === undefined || !dates || !bookingId) {
      return res.status(400).json({ success: false, error: 'Please provide all required booking fields' });
    }

    const bookingData = {
      user: req.user.uid,
      userName: req.user.name,
      tourId,
      tourName,
      price: Number(price),
      status: 'UPCOMING',
      dates,
      bookingId,
      image: image || '',
      createdAt: new Date().toISOString()
    };

    const docRef = await db.collection('bookings').add(bookingData);

    res.status(201).json({
      success: true,
      booking: {
        id: docRef.id,
        ...bookingData
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get bookings for the logged-in user
 * @route   GET /api/bookings/my-bookings
 * @access  Private
 */
const getUserBookings = async (req, res, next) => {
  try {
    const bookingsSnapshot = await db.collection('bookings')
      .where('user', '==', req.user.uid)
      .get();

    const bookings = [];
    bookingsSnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get all bookings (Admin only)
 * @route   GET /api/bookings
 * @access  Private/Admin
 */
const getAllBookings = async (req, res, next) => {
  try {
    const bookingsSnapshot = await db.collection('bookings')
      .orderBy('createdAt', 'desc')
      .get();

    const bookings = [];
    bookingsSnapshot.forEach((doc) => {
      bookings.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json({
      success: true,
      count: bookings.length,
      bookings
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings
};
