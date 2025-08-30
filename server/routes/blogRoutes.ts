import express from 'express';
import { authMiddleware } from '../middleware/authMiddleware';
import {
  createBlog,
  listApprovedBlogs,
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
router.get('/:id', authMiddleware, getBlog); // require auth to view non-approved own drafts

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
