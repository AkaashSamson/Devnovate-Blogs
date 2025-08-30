import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IBlog extends Document {
  title: string;
  content: string;
  user_id: Types.ObjectId;
  created_at: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const blogSchema = new Schema<IBlog>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 200
  },
  content: {
    type: String,
    required: true,
    minlength: 1
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
    index: true
  }
});

// Optional compound index for queries by user and date
blogSchema.index({ user_id: 1, created_at: -1 });

const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;