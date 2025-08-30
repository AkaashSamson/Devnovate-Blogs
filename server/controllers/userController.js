const User = require('../models/usermodel');
const Blog = require('../models/blogmodel');

// GET /api/users/me - returns current authenticated user (minus sensitive fields)
const getCurrentUser = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const user = await User.findById(userId).select('-password -verifyOtp -resetOtp');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get user statistics
    const totalBlogs = await Blog.countDocuments({ user_id: userId });
    const approvedBlogs = await Blog.countDocuments({ user_id: userId, status: 'approved' });
    
    // Get total views and likes from user's approved blogs
    const blogStats = await Blog.aggregate([
      { $match: { user_id: userId, status: 'approved' } },
      {
        $group: {
          _id: null,
          totalViews: { $sum: '$views' },
          totalLikes: { $sum: { $size: '$likes_coll' } }
        }
      }
    ]);

    const stats = blogStats[0] || { totalViews: 0, totalLikes: 0 };

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        website: user.website,
        isAdmin: user.isAdmin,
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt,
        stats: {
          articles: approvedBlogs,
          totalBlogs: totalBlogs,
          totalViews: stats.totalViews,
          totalLikes: stats.totalLikes,
          followers: 0, // TODO: Implement follower system
          following: 0  // TODO: Implement following system
        }
      }
    });
  } catch (error) {
    console.error('getCurrentUser error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// PUT /api/users/me - update current user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { name, bio, location, website } = req.body;

    // Validate input
    if (bio && bio.length > 500) {
      return res.status(400).json({ success: false, message: 'Bio must be 500 characters or less' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name !== undefined) user.name = name.trim();
    if (bio !== undefined) user.bio = bio.trim();
    if (location !== undefined) user.location = location.trim();
    if (website !== undefined) user.website = website.trim();

    await user.save();

    return res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        location: user.location,
        website: user.website,
        isAdmin: user.isAdmin,
        isAccountVerified: user.isAccountVerified,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('updateUserProfile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  getCurrentUser,
  updateUserProfile
};
