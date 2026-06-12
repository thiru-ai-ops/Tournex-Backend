const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Booking destination or package name is required'],
    trim: true,
    maxlength: [256, 'Booking name cannot exceed 256 characters']
  },
  status: {
    type: String,
    enum: ['UPCOMING', 'COMPLETED', 'CANCELLED'],
    default: 'UPCOMING'
  },
  dates: {
    type: String,
    required: [true, 'Booking date range is required']
  },
  price: {
    type: Number,
    required: [true, 'Booking price is required'],
    min: [0, 'Booking price cannot be negative']
  },
  bookingId: {
    type: String,
    required: [true, 'Booking reference ID is required'],
    trim: true
  },
  image: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Booking', bookingSchema);
