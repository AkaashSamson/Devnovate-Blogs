import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import { optionalAuthMiddleware } from '../middleware/optionalAuthMiddleware';
import {
  createBlog,
  listApprovedBlogs,
  listPendingBlogs,
  getUserBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  approveBlog,
  rejectBlog
} from '../controllers/blogController';

const router = express.Router();

// Public
router.get('/', listApprovedBlogs);
router.get('/:id', optionalAuthMiddleware, getBlog); // Allow public access with optional auth
router.get('/pending', authMiddleware, listPendingBlogs); // Admin only  
router.get('/my-blogs', authMiddleware, getUserBlogs); // User's own blogs

// Authenticated user routes
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

// Like and comment routes
router.post('/:id/like', authMiddleware, toggleLike);
router.post('/:id/comments', authMiddleware, addComment);

// Admin placeholders (should add real admin check later)
router.post('/:id/approve', authMiddleware, approveBlog);
router.post('/:id/reject', authMiddleware, rejectBlog);

export default router;
