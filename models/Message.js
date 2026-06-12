const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'ai'],
    required: [true, 'Message sender type is required']
  },
  text: {
    type: String,
    required: [true, 'Message text is required']
  },
  image: {
    type: String,
    default: ''
  },
  time: {
    type: String,
    required: [true, 'Message time string is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Message', messageSchema);
