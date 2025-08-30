const mongoose = require('mongoose');
const Blog = require('../models/blogmodel');
const User = require('../models/usermodel');

// Create a new blog post
const createBlog = async (req, res) => {
  try {
    const { title, content, excerpt, tags, featured_image } = req.body;
    if (!title || !content || !excerpt) {
      return res.status(400).json({ success: false, message: 'Title, content, and excerpt are required' });
    }
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Get author name from user
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    const blog = await Blog.create({ 
      title, 
      content, 
      excerpt,
      user_id: userId, 
      author_name: user.name,
      tags: tags || [],
      featured_image: featured_image || undefined
    });
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error('createBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get trending blogs (public, only approved, sorted by engagement)
const getTrendingBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'approved' })
      .populate('user_id', 'name')
      .sort({ published_at: -1 });
    
    // Calculate trending score and transform to match frontend schema
    const transformedBlogs = blogs.map(blog => {
      const trendingScore = blog.likes_coll.length + blog.comments_coll.length + Math.floor(blog.views / 10);
      
      return {
        id: blog._id,
        title: blog.title,
        excerpt: blog.excerpt,
        author_name: blog.author_name,
        tags: blog.tags,
        featured_image: blog.featured_image,
        views: blog.views,
        likes: blog.likes_coll.length,
        comments_count: blog.comments_coll.length,
        trending_points: trendingScore,
        published_at: blog.published_at.toISOString().split('T')[0], // YYYY-MM-DD format
      };
    });

    // Sort by trending score (highest first)
    transformedBlogs.sort((a, b) => b.trending_points - a.trending_points);

    return res.status(200).json({ success: true, blogs: transformedBlogs });
  } catch (error) {
    console.error('getTrendingBlogs error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all blogs (public, only approved)
const listApprovedBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find({ status: 'approved' })
      .populate('user_id', 'name')
      .sort({ published_at: -1 });
    
    // Transform to match frontend schema expectations (same as TypeScript version)
    const transformedBlogs = blogs.map(blog => ({
      id: blog._id,
      title: blog.title,
      excerpt: blog.excerpt,
      author_name: blog.author_name,
      tags: blog.tags,
      featured_image: blog.featured_image,
      views: blog.views,
      likes: blog.likes_coll.length,
      comments_count: blog.comments_coll.length,
      published_at: blog.published_at.toISOString().split('T')[0], // YYYY-MM-DD format
    }));

    return res.status(200).json({ success: true, blogs: transformedBlogs });
  } catch (error) {
    console.error('listApprovedBlogs error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get user's own blogs (all statuses)
const getUserBlogs = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const blogs = await Blog.find({ user_id: userId })
      .sort({ created_at: -1 });
    
    // Transform to match frontend schema expectations (same as TypeScript version)
    const transformedBlogs = blogs.map(blog => ({
      id: blog._id,
      title: blog.title,
      excerpt: blog.excerpt,
      author: {
        name: blog.author_name,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`
      },
      publishedAt: blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }) : null,
      lastModified: new Date(blog.updated_at || blog.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      readTime: `${Math.ceil((blog.content?.length || 0) / 1000)} min read`,
      tags: blog.tags || [],
      likes: blog.likes_coll.length,
      comments: blog.comments_coll.length,
      views: blog.views,
      status: blog.status,
      coverImage: blog.featured_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
    }));

    return res.status(200).json({ success: true, blogs: transformedBlogs });
  } catch (error) {
    console.error('getUserBlogs error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get pending blogs (admin only)
const listPendingBlogs = async (req, res) => {
  try {
    const userId = req.userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const blogs = await Blog.find({ status: 'pending' })
      .populate('user_id', 'name')
      .sort({ created_at: -1 });
    
    // Transform to match frontend schema expectations (same as TypeScript version)
    const transformedBlogs = blogs.map(blog => ({
      id: blog._id,
      title: blog.title,
      excerpt: blog.excerpt,
      author: {
        name: blog.author_name,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face`
      },
      submittedAt: new Date(blog.created_at).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      tags: blog.tags || [],
      wordCount: blog.content ? blog.content.split(' ').length : 0
    }));

    return res.status(200).json({ success: true, blogs: transformedBlogs });
  } catch (error) {
    console.error('listPendingBlogs error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Approve a blog (admin only)
const approveBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.status = 'approved';
    blog.published_at = new Date(); // Set publication date like TypeScript version
    await blog.save();

    return res.status(200).json({ success: true, message: 'Blog approved successfully' });
  } catch (error) {
    console.error('approveBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reject a blog (admin only)
const rejectBlog = async (req, res) => {
  try {
    const userId = req.userId;
    const { id } = req.params;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    blog.status = 'rejected';
    await blog.save();

    return res.status(200).json({ success: true, message: 'Blog rejected successfully' });
  } catch (error) {
    console.error('rejectBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get single blog with optional authentication
const getBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId; // Optional - set by optionalAuthMiddleware

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id)
      .populate('user_id', 'name email')
      .populate('comments_coll.user_id', 'name');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Check access permissions
    const isOwner = userId && blog.user_id._id.toString() === userId;
    const isAdmin = userId ? await User.findById(userId).then(user => user?.isAdmin) : false;
    
    // Only allow access to approved blogs for non-owners/non-admins
    if (blog.status !== 'approved' && !isOwner && !isAdmin) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Increment view count (only for approved blogs and not for the owner)
    if (blog.status === 'approved' && !isOwner) {
      await Blog.findByIdAndUpdate(id, { $inc: { views: 1 } });
      blog.views += 1;
    }

    // Check if user has liked this blog
    const isLiked = userId ? blog.likes_coll.includes(new mongoose.Types.ObjectId(userId)) : false;

    const transformedBlog = {
      id: blog._id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author_name: blog.author_name,
      author_email: blog.user_id.email,
      tags: blog.tags,
      featured_image: blog.featured_image,
      views: blog.views,
      likes_count: blog.likes_coll.length,
      comments_count: blog.comments_coll.length,
      published_at: blog.published_at,
      created_at: blog.created_at,
      status: blog.status,
      isLiked: isLiked,
      comments: blog.comments_coll.map(comment => ({
        id: comment._id,
        text: comment.text,
        user_name: comment.user_id?.name || 'Anonymous',
        created_at: comment.created_at
      }))
    };

    return res.status(200).json({ success: true, blog: transformedBlog });
  } catch (error) {
    console.error('getBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Toggle like on a blog
const toggleLike = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Only allow liking approved blogs
    if (blog.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Cannot like non-approved blog' });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const isLiked = blog.likes_coll.includes(userObjectId);

    if (isLiked) {
      // Unlike
      blog.likes_coll = blog.likes_coll.filter(id => !id.equals(userObjectId));
    } else {
      // Like
      blog.likes_coll.push(userObjectId);
    }

    await blog.save();

    return res.status(200).json({ 
      success: true, 
      isLiked: !isLiked,
      likes_count: blog.likes_coll.length 
    });
  } catch (error) {
    console.error('toggleLike error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add comment to a blog
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Only allow commenting on approved blogs
    if (blog.status !== 'approved') {
      return res.status(400).json({ success: false, message: 'Cannot comment on non-approved blog' });
    }

    const comment = {
      user_id: new mongoose.Types.ObjectId(userId),
      text: text.trim(),
      created_at: new Date()
    };

    blog.comments_coll.push(comment);
    await blog.save();

    // Get user name for response
    const user = await User.findById(userId).select('name');
    
    return res.status(201).json({ 
      success: true, 
      comment: {
        id: comment._id,
        text: comment.text,
        user_name: user?.name || 'Anonymous',
        created_at: comment.created_at
      },
      comments_count: blog.comments_coll.length
    });
  } catch (error) {
    console.error('addComment error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update a blog (owner only)
const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, tags, featured_image } = req.body;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Check if user is the owner
    if (blog.user_id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this blog' });
    }

    // Update fields
    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (tags) blog.tags = tags;
    if (featured_image !== undefined) blog.featured_image = featured_image;

    // Reset status to pending if content changed
    if (title || content || excerpt) {
      blog.status = 'pending';
    }

    await blog.save();

    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('updateBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete a blog (owner only)
const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });

    // Check if user is the owner
    if (blog.user_id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(id);

    return res.status(200).json({ success: true, message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('deleteBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get single pending blog for admin preview
const getPendingBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.userId;

    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    // Check if user is admin
    const user = await User.findById(userId);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid blog ID' });
    }

    const blog = await Blog.findById(id)
      .populate('user_id', 'name email');

    if (!blog) {
      return res.status(404).json({ success: false, message: 'Blog not found' });
    }

    // Only allow access to pending blogs for admin preview
    if (blog.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'Blog is not pending' });
    }

    const transformedBlog = {
      id: blog._id,
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      author: {
        name: blog.author_name,
        avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face`,
        bio: "Content creator"
      },
      tags: blog.tags || [],
      featured_image: blog.featured_image,
      submittedAt: new Date(blog.created_at).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }),
      wordCount: blog.content ? blog.content.split(' ').length : 0,
      status: blog.status,
      created_at: blog.created_at
    };

    return res.status(200).json({ success: true, blog: transformedBlog });
  } catch (error) {
    console.error('getPendingBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createBlog,
  listApprovedBlogs,
  getTrendingBlogs,
  getUserBlogs,
  listPendingBlogs,
  getPendingBlog,
  approveBlog,
  rejectBlog,
  getBlog,
  toggleLike,
  addComment,
  updateBlog,
  deleteBlog
};
