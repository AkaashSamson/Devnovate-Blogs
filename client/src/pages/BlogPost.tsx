import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Heart, MessageCircle, Share2, Bookmark, Eye, Calendar, Send } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const BlogPost = () => {
  const { id } = useParams();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);
  
  const { backendUrl, isLoggedIn } = useAppContext();
  const { toast } = useToast();
  
  // Mock data - replace with real data from your backend
  const mockPost = {
    id: "1",
    title: "Building Scalable React Applications with TypeScript",
    content: `
# Introduction

Building scalable React applications is crucial for long-term success. In this comprehensive guide, we'll explore the best practices for structuring your React applications with TypeScript.

## Setting Up Your Project Structure

When starting a new React project, the structure you choose will impact your development experience significantly.

\`\`\`typescript
// Example of a well-structured component
interface UserProfileProps {
  user: User;
  onUpdate: (user: User) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  onUpdate 
}) => {
  // Component implementation
};
\`\`\`

## Key Principles

1. **Component Composition**: Break down complex UIs into smaller, reusable components
2. **Type Safety**: Leverage TypeScript to catch errors early
3. **State Management**: Choose the right state management solution for your needs
4. **Testing**: Write comprehensive tests for your components

## Performance Optimization

React provides several tools for optimization:

- React.memo for component memoization
- useMemo and useCallback hooks
- Code splitting with React.lazy
- Virtual scrolling for large lists

## Conclusion

Building scalable React applications requires careful planning and adherence to best practices. By following the principles outlined in this guide, you'll be well on your way to creating maintainable and performant applications.
    `,
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
      bio: "Full-stack developer passionate about React and TypeScript. Building scalable web applications for 5+ years."
    },
    publishedAt: "March 15, 2024",
    readTime: "8 min read",
    tags: ["React", "TypeScript", "Architecture", "Best Practices"],
    likes: 245,
    comments: 18,
    views: 1200,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop"
  };

  // Fetch blog post data
  useEffect(() => {
    const fetchBlogPost = async () => {
      if (!id) return;
      
      // If it's a dummy blog (id 1, 2, or 3), use mock data
      if (['1', '2', '3'].includes(id)) {
        setPost(mockPost);
        setLikesCount(mockPost.likes);
        setLoading(false);
        return;
      }
      
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/blogs/${id}`);
        
        if (response.data.success) {
          const blogData = response.data.blog;
          setPost({
            id: blogData._id,
            title: blogData.title,
            content: blogData.content,
            excerpt: blogData.excerpt,
            author: {
              name: blogData.author_name,
              avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=64&h=64&fit=crop&crop=face",
              bio: "Developer and content creator" // Default bio
            },
            publishedAt: blogData.published_at ? new Date(blogData.published_at).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            }) : "Recently",
            readTime: `${Math.ceil(blogData.content.length / 1000)} min read`,
            tags: blogData.tags || [],
            likes: blogData.likes_coll?.length || 0,
            comments: blogData.comments_coll?.length || 0,
            views: blogData.views || 0,
            coverImage: blogData.featured_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop"
          });
          setLikesCount(blogData.likes_coll?.length || 0);
          setComments(blogData.comments_coll || []);
          
          // Check if user has liked this post
          if (isLoggedIn && blogData.likes_coll) {
            // This would need user ID to check properly - for now just set false
            setIsLiked(false);
          }
        }
      } catch (error) {
        console.error('Error fetching blog post:', error);
        toast({
          title: "Error",
          description: "Failed to load blog post.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogPost();
  }, [id, backendUrl, isLoggedIn, toast]);

  // Handle like/unlike
  const handleLike = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please log in to like posts.",
        variant: "destructive",
      });
      return;
    }

    if (['1', '2', '3'].includes(id || '')) {
      // For dummy posts, just toggle locally
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      return;
    }

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/blogs/${id}/like`);
      
      if (response.data.success) {
        setIsLiked(response.data.liked);
        setLikesCount(response.data.likesCount);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      toast({
        title: "Error",
        description: "Failed to update like status.",
        variant: "destructive",
      });
    }
  };

  // Handle comment submission
  const handleSubmitComment = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Login required",
        description: "Please log in to comment.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please write something before submitting.",
        variant: "destructive",
      });
      return;
    }

    if (['1', '2', '3'].includes(id || '')) {
      // For dummy posts, just add comment locally
      const dummyComment = {
        _id: Date.now().toString(),
        text: newComment.trim(),
        user_id: { name: "You" },
        created_at: new Date()
      };
      setComments(prev => [...prev, dummyComment]);
      setNewComment("");
      return;
    }

    setSubmittingComment(true);
    try {
      axios.defaults.withCredentials = true;
      const response = await axios.post(`${backendUrl}/blogs/${id}/comments`, {
        text: newComment.trim()
      });
      
      if (response.data.success) {
        setComments(prev => [...prev, response.data.comment]);
        setNewComment("");
        toast({
          title: "Comment added",
          description: "Your comment has been posted successfully.",
        });
      }
    } catch (error) {
      console.error('Error submitting comment:', error);
      toast({
        title: "Error",
        description: "Failed to post comment.",
        variant: "destructive",
      });
    } finally {
      setSubmittingComment(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {loading ? (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading article...</p>
            </div>
          </div>
        </div>
      ) : !post ? (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Not Found</h1>
            <p className="text-muted-foreground">The article you're looking for doesn't exist.</p>
          </div>
        </div>
      ) : (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Cover Image */}
        {post.coverImage && (
          <div className="aspect-video mb-8 rounded-xl overflow-hidden shadow-medium">
            <img 
              src={post.coverImage} 
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            {post.title}
          </h1>
          
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarImage src={post.author.avatar} />
                <AvatarFallback>
                  {post.author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold">{post.author.name}</h3>
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{post.publishedAt}</span>
                  <span>•</span>
                  <span>{post.readTime}</span>
                  <span>•</span>
                  <Eye className="h-4 w-4" />
                  <span>{post.views} views</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={isLiked ? "default" : "outline"}
                size="sm"
                onClick={handleLike}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {likesCount}
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                {comments.length}
              </Button>
              <Button
                variant={isBookmarked ? "default" : "outline"}
                size="sm"
                onClick={() => setIsBookmarked(!isBookmarked)}
              >
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
              </Button>
              <Button variant="outline" size="sm">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </header>
        
        <Separator className="mb-8" />
        
        {/* Article Content */}
        <div className="prose prose-lg max-w-none">
          <div className="whitespace-pre-wrap leading-relaxed">
            {post.content}
          </div>
        </div>
        
        <Separator className="my-8" />
        
        {/* Author Bio */}
        <div className="bg-gradient-card p-6 rounded-xl shadow-soft">
          <h3 className="text-xl font-bold mb-4">About the Author</h3>
          <div className="flex items-start space-x-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={post.author.avatar} />
              <AvatarFallback>
                {post.author.name.split(' ').map((n: string) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <h4 className="text-lg font-semibold mb-2">{post.author.name}</h4>
              <p className="text-muted-foreground">{post.author.bio}</p>
              <Button variant="outline" className="mt-3">
                Follow
              </Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Comments Section */}
        <div className="space-y-6">
          <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>
          
          {/* Add Comment Form */}
          {isLoggedIn ? (
            <Card className="p-6">
              <div className="space-y-4">
                <h4 className="font-semibold">Add a comment</h4>
                <Textarea
                  placeholder="Share your thoughts..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  rows={3}
                />
                <div className="flex justify-end">
                  <Button 
                    onClick={handleSubmitComment}
                    disabled={submittingComment || !newComment.trim()}
                  >
                    <Send className="h-4 w-4 mr-2" />
                    {submittingComment ? "Posting..." : "Post Comment"}
                  </Button>
                </div>
              </div>
            </Card>
          ) : (
            <Card className="p-6 text-center">
              <p className="text-muted-foreground mb-4">Please log in to join the conversation</p>
              <Button variant="outline">Log In to Comment</Button>
            </Card>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <Card key={comment._id} className="p-4">
                  <div className="flex items-start space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback>
                        {comment.user_id?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="font-medium">{comment.user_id?.name || 'Anonymous'}</span>
                        <span className="text-sm text-muted-foreground">
                          {new Date(comment.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center">
                <MessageCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h4 className="font-semibold mb-2">No comments yet</h4>
                <p className="text-muted-foreground">Be the first to share your thoughts!</p>
              </Card>
            )}
          </div>
        </div>
        </article>
      )}
    </div>
  );
};

export default BlogPost;