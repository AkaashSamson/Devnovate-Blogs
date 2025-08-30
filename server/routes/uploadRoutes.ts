// server/routes/uploadRoutes.ts
import express from 'express';
import { uploadImage, upload } from '../controllers/uploadController';
import { authMiddleware } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/image', authMiddleware, upload.single('image'), uploadImage);

export default router;