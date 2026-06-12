const User = require('../models/User');

/**
 * @desc    Get user profile
 * @route   GET /api/user/profile
 * @access  Private
 */
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        bio: user.bio,
        location: user.location,
        tier: user.tier,
        joinDate: user.joinDate,
        stats: {
          statesVisited: user.statesVisited,
          savedTripsCount: user.savedTripsCount,
          reviewsCount: user.reviewsCount,
          savedTotal: user.savedTotal
        },
        level: user.level,
        currentXp: user.currentXp,
        maxXp: user.maxXp
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/user/profile
 * @access  Private
 */
const updateUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, error: 'User profile not found' });
    }

    // Assign parameters
    const fieldsToUpdate = [
      'name', 'avatar', 'bio', 'location',
      'statesVisited', 'savedTripsCount', 'reviewsCount', 'savedTotal',
      'level', 'currentXp', 'maxXp'
    ];

    fieldsToUpdate.forEach((field) => {
      if (req.body[field] !== undefined) {
        if (field === 'stats' && typeof req.body.stats === 'object') {
          // Map sub-object nested keys
          if (req.body.stats.statesVisited !== undefined) user.statesVisited = Number(req.body.stats.statesVisited);
          if (req.body.stats.savedTripsCount !== undefined) user.savedTripsCount = Number(req.body.stats.savedTripsCount);
          if (req.body.stats.reviewsCount !== undefined) user.reviewsCount = Number(req.body.stats.reviewsCount);
          if (req.body.stats.savedTotal !== undefined) user.savedTotal = Number(req.body.stats.savedTotal);
        } else {
          user[field] = req.body[field];
        }
      }
    });

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bio: updatedUser.bio,
        location: updatedUser.location,
        tier: updatedUser.tier,
        joinDate: updatedUser.joinDate,
        stats: {
          statesVisited: updatedUser.statesVisited,
          savedTripsCount: updatedUser.savedTripsCount,
          reviewsCount: updatedUser.reviewsCount,
          savedTotal: updatedUser.savedTotal
        },
        level: updatedUser.level,
        currentXp: updatedUser.currentXp,
        maxXp: updatedUser.maxXp
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
