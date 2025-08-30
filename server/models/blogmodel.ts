import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IComment {
  user_id: Types.ObjectId;
  text: string;
  created_at: Date;
}

export interface IBlog extends Document {
  title: string;
  content: string;
  excerpt: string;
  user_id: Types.ObjectId;
  author_name: string;
  tags: string[];
  featured_image?: string;
  views: number;
  likes_coll: Types.ObjectId[];
  comments_coll: IComment[];
  published_at: Date;
  created_at: Date;
  updated_at: Date;
  status: 'pending' | 'approved' | 'rejected';
}

const commentSchema = new Schema<IComment>({
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 1000
  },
  created_at: {
    type: Date,
    default: Date.now
  }
});

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
  excerpt: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    maxlength: 500
  },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  author_name: {
    type: String,
    required: true,
    trim: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featured_image: {
    type: String,
    trim: true
  },
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  likes_coll: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  comments_coll: [commentSchema],
  published_at: {
    type: Date,
    default: Date.now
  },
  created_at: {
    type: Date,
    default: Date.now
  },
  updated_at: {
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

// Indexes for performance
blogSchema.index({ user_id: 1, created_at: -1 });
blogSchema.index({ status: 1, published_at: -1 });
blogSchema.index({ tags: 1 });
blogSchema.index({ views: -1 });

// Update the updated_at field before saving
blogSchema.pre('save', function(next) {
  this.updated_at = new Date();
  next();
});

const Blog = mongoose.models.Blog || mongoose.model<IBlog>('Blog', blogSchema);

export default Blog;