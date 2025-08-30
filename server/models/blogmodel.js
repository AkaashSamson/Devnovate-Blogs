const mongoose = require('mongoose');
const { Schema } = mongoose;

const commentSchema = new Schema({
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

const blogSchema = new Schema({
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

const Blog = mongoose.models.Blog || mongoose.model('Blog', blogSchema);

module.exports = Blog;
