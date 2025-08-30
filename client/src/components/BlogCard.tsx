import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock, Eye } from "lucide-react";
import { Link } from "react-router-dom";

interface BlogCardProps {
  id: string;
  title: string;
  excerpt: string;
  author: {
    name: string;
    avatar?: string;
  };
  publishedAt: string;
  readTime: string;
  tags: string[];
  likes: number;
  comments: number;
  views: number;
  coverImage?: string;
}

const BlogCard = ({ 
  id, 
  title, 
  excerpt, 
  author, 
  publishedAt, 
  readTime, 
  tags, 
  likes, 
  comments, 
  views,
  coverImage 
}: BlogCardProps) => {
  return (
    <Card className="group bg-gradient-card shadow-soft hover:shadow-medium transition-all duration-300 border-0 overflow-hidden">
      <Link to={`/blog/${id}`} className="block">
        {coverImage && (
          <div className="aspect-video overflow-hidden">
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>
        )}
        
        <div className="p-6">
          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
            {excerpt}
          </p>
          
          {/* Author and Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={author.avatar} />
                <AvatarFallback>
                  {author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">{author.name}</p>
                <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                  <span>{publishedAt}</span>
                  <span>•</span>
                  <Clock className="h-3 w-3" />
                  <span>{readTime}</span>
                </div>
              </div>
            </div>
            
            {/* Engagement Stats */}
            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Heart className="h-3 w-3" />
                <span>{likes}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageCircle className="h-3 w-3" />
                <span>{comments}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{views}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;