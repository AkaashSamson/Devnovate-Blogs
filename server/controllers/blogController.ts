import { Request, Response } from 'express';
import Blog from '../models/blogmodel';

// Create a new blog post
export const createBlog = async (req: Request, res: Response) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ success: false, message: 'Title and content are required' });
    }
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const blog = await Blog.create({ title, content, user_id: userId });
    return res.status(201).json({ success: true, blog });
  } catch (error) {
    console.error('createBlog error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// Get all blogs (public, only approved)
export const listApprovedBlogs = async (_req: Request, res: Response) => {
  try {
    const blogs = await Blog.find({ status: 'approved' }).sort({ created_at: -1 });
    return res.status(200).json({ success: true, blogs });
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
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.status !== 'approved' && blog.user_id.toString() !== userId) {
      return res.status(403).json({ success: false, message: 'Forbidden' });
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
    const { title, content } = req.body;
    const userId = (req as any).userId;
    if (!userId) return res.status(401).json({ success: false, message: 'Unauthorized' });
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    if (blog.user_id.toString() !== userId) return res.status(403).json({ success: false, message: 'Forbidden' });

    if (title) blog.title = title;
    if (content) blog.content = content;
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

// Approve blog (admin placeholder)
export const approveBlog = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id);
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    blog.status = 'approved';
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
