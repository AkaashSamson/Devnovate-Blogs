const express = require('express');
const { authMiddleware } = require('../middleware/authMiddleware');
const { optionalAuthMiddleware } = require('../middleware/optionalAuthMiddleware');
const {
  createBlog,
  listApprovedBlogs,
  getTrendingBlogs,
  listPendingBlogs,
  getPendingBlog,
  getUserBlogs,
  getBlog,
  updateBlog,
  deleteBlog,
  toggleLike,
  addComment,
  approveBlog,
  rejectBlog
} = require('../controllers/blogController');

const router = express.Router();

// Specific routes first (before parameterized routes)
router.get('/trending', getTrendingBlogs); // Get trending blogs
router.get('/pending', authMiddleware, listPendingBlogs); // Admin only  
router.get('/pending/:id', authMiddleware, getPendingBlog); // Admin preview single pending blog
router.get('/my-blogs', authMiddleware, getUserBlogs); // User's own blogs

// Public routes
router.get('/', listApprovedBlogs);
router.get('/:id', optionalAuthMiddleware, getBlog); // Allow public access with optional auth

// Authenticated user routes
router.post('/', authMiddleware, createBlog);
router.put('/:id', authMiddleware, updateBlog);
router.delete('/:id', authMiddleware, deleteBlog);

// Like and comment routes
router.post('/:id/like', authMiddleware, toggleLike);
router.post('/:id/comments', authMiddleware, addComment);

// Admin routes
router.post('/:id/approve', authMiddleware, approveBlog);
router.post('/:id/reject', authMiddleware, rejectBlog);

module.exports = router;
