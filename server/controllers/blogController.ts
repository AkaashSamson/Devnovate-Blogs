import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Blog from '../models/blogmodel';
import User from '../models/usermodel';

// Create a new blog post
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content, excerpt, tags, featured_image } = req.body;
    if (!title || !content || !excerpt) {
      return res.status(400).json({ success: false, message: 'Title, content, and excerpt are required' });
    }
    const userId = (req as any).userId;
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

// Get all blogs (public, only approved)
export const listApprovedBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ status: 'approved' })
      .populate('user_id', 'name')
      .sort({ published_at: -1 });
    
    // Transform to match frontend schema expectations
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

// Get single blog (approved or owned)
export const getBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const blog = await Blog.findById(id).populate('comments_coll.user_id', 'name');
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.status !== 'approved' && blog.user_id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
    }
    
    // Increment views if it's an approved blog
    if (blog.status === 'approved') {
      blog.views += 1;
      await blog.save();
    }
    
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('getBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Update blog (only owner, cannot directly set status)
export const updateBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, content, excerpt, tags, featured_image } = req.body;
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.user_id.toString() !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (excerpt) blog.excerpt = excerpt;
    if (tags) blog.tags = tags;
    if (featured_image !== undefined) blog.featured_image = featured_image;
    
    // Reset status to pending on content change if previously rejected
    if (blog.status === 'rejected') blog.status = 'pending';
    await blog.save();
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('updateBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Delete blog (only owner)
export const deleteBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.user_id.toString() !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });
    await blog.deleteOne();
    return res.status(200).json({ success: true, message: 'Blog deleted' });
  } catch (error) {
    console.error('deleteBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Like/Unlike blog
export const toggleLike = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.status !== 'approved') return res.status(403).json({ success: false, message: 'Cannot like unpublished blog' });
    
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = blog.likes_coll.includes(userObjectId);
    
    if (hasLiked) {
      blog.likes_coll.pull(userObjectId);
    } else {
      blog.likes_coll.push(userObjectId);
    }
    
    await blog.save();
    return res.status(200).json({ 
      success: true, 
      liked: !hasLiked, 
      likesCount: blog.likes_coll.length 
    });
  } catch (error) {
    console.error('toggleLike error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Add comment
export const addComment = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ success: false, message: 'Comment text is required' });
    }
    
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.status !== 'approved') return res.status(403).json({ success: false, message: 'Cannot comment on unpublished blog' });
    
    const comment = {
      user_id: new mongoose.Types.ObjectId(userId),
      text: text.trim(),
      created_at: new Date()
    };
    
    blog.comments_coll.push(comment);
    await blog.save();
    
    // Populate the comment with user info before returning
    await blog.populate('comments_coll.user_id', 'name');
    const newComment = blog.comments_coll[blog.comments_coll.length - 1];
    
    return res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error('addComment error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Approve blog (admin placeholder)
export const approveBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.status = 'approved';
    blog.published_at = new Date();
    await blog.save();
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('approveBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Reject blog (admin placeholder)
export const rejectBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.status = 'rejected';
    await blog.save();
    return res.status(200).json({ success: true, blog });
  } catch (error) {
    console.error('rejectBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
