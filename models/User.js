const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please fill a valid email address'
    ]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [5, 'Password must be at least 5 characters']
  },
  // Profile Fields
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [256, 'Name cannot exceed 256 characters']
  },
  avatar: {
    type: String,
    required: [true, 'Avatar is required'],
    default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
  },
  bio: {
    type: String,
    default: 'Wandering the cultural trails of India in search of stories and flavors.',
    maxlength: [1024, 'Bio cannot exceed 1024 characters']
  },
  location: {
    type: String,
    default: 'New Delhi, India',
    maxlength: [256, 'Location cannot exceed 256 characters']
  },
  joinDate: {
    type: String,
    default: 'Joined Today'
  },
  statesVisited: {
    type: Number,
    default: 0
  },
  savedTripsCount: {
    type: Number,
    default: 0
  },
  reviewsCount: {
    type: Number,
    default: 0
  },
  savedTotal: {
    type: Number,
    default: 0
  },
  level: {
    type: Number,
    default: 1
  },
  currentXp: {
    type: Number,
    default: 100
  },
  maxXp: {
    type: Number,
    default: 1000
  }
}, {
  timestamps: true
});

// Pre-save password hashing middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Instance method to check password match
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
