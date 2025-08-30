import { useState } from "react";
import { useParams } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Heart, MessageCircle, Share2, Bookmark, Eye, Calendar } from "lucide-react";

const BlogPost = () => {
  const { id } = useParams();
  const [isLiked, setIsLiked] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  
  // Mock data - replace with real data from your backend
  const post = {
    id: id || "1",
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
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
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`h-4 w-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
                {post.likes}
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                {post.comments}
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
                {post.author.name.split(' ').map(n => n[0]).join('')}
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
      </article>
    </div>
  );
};

export default BlogPost;