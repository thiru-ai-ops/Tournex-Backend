const axios = require('axios');
const { auth, db } = require('../config/firebase');

/**
 * @desc    Register a new user in Firebase Auth and store profile in Firestore
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password, avatar, role, bio, location } = req.body;

    // Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide name, email, and password' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, error: 'Password must be at least 6 characters for Firebase Auth' });
    }

    // Create user in Firebase Authentication
    const userRecord = await auth.createUser({
      email: email.toLowerCase(),
      password,
      displayName: name,
      photoURL: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150'
    });

    const userProfile = {
      name,
      email: email.toLowerCase(),
      avatar: avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=150',
      role: role || 'user',
      bio: bio || 'Wandering the cultural trails of India in search of stories and flavors.',
      location: location || 'New Delhi, India',
      joinDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      statesVisited: 0,
      savedTripsCount: 0,
      reviewsCount: 0,
      savedTotal: 0,
      level: 1,
      currentXp: 100,
      maxXp: 1000
    };

    // Store user profile in Firestore
    await db.collection('users').doc(userRecord.uid).set(userProfile);

    res.status(201).json({
      success: true,
      user: {
        uid: userRecord.uid,
        ...userProfile
      }
    });
  } catch (error) {
    console.error('Registration Error:', error.message);
    next(error);
  }
};

/**
 * @desc    Log in user using Google Identity Toolkit REST API and fetch Firestore profile
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Please provide email and password' });
    }

    const apiKey = process.env.FIREBASE_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, error: 'Firebase API key is not configured in .env file' });
    }

    // Call Firebase Auth REST API to verify password and get ID token
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${apiKey}`;
    const response = await axios.post(url, {
      email: email.toLowerCase(),
      password,
      returnSecureToken: true
    });

    const { idToken, localId } = response.data;

    // Fetch user profile from Firestore users collection
    const userSnap = await db.collection('users').doc(localId).get();

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, error: 'User profile not found in database' });
    }

    res.json({
      success: true,
      token: idToken,
      user: {
        uid: localId,
        ...userSnap.data()
      }
    });
  } catch (error) {
    console.error('Login Error:', error.response?.data?.error?.message || error.message);
    const apiErrorMsg = error.response?.data?.error?.message || 'Invalid email or password';
    res.status(400).json({ success: false, error: apiErrorMsg });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getCurrentUserProfile = async (req, res, next) => {
  try {
    const userSnap = await db.collection('users').doc(req.user.uid).get();

    if (!userSnap.exists) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    res.json({
      success: true,
      user: {
        uid: req.user.uid,
        ...userSnap.data()
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  registerUser,
  loginUser,
  getCurrentUserProfile
};
