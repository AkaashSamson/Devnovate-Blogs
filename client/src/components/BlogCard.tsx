import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MessageCircle, Clock, Eye, BookOpen } from "lucide-react";
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
    <Card className="group bg-white hover:bg-gray-50/50 shadow-lg hover:shadow-2xl transition-all duration-500 border-0 overflow-hidden rounded-2xl transform hover:-translate-y-2">
      <Link to={`/blog/${id}`} className="block">
        {coverImage && (
          <div className="aspect-video overflow-hidden relative">
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute top-4 left-4">
              <div className="flex flex-wrap gap-2">
                {tags.slice(0, 2).map((tag) => (
                  <Badge 
                    key={tag} 
                    variant="secondary" 
                    className="text-xs bg-white/90 backdrop-blur-sm text-gray-700 border-0 shadow-sm"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        )}
        
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {title}
          </h3>
          
          {/* Excerpt */}
          <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed text-sm">
            {excerpt}
          </p>
          
          {/* Author and Meta */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10 ring-2 ring-gray-100 group-hover:ring-blue-200 transition-all duration-300">
                <AvatarImage src={author.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-500 text-white font-medium">
                  {author.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-semibold text-gray-900">{author.name}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <span>{publishedAt}</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{readTime}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Engagement Stats */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <div className="flex items-center space-x-1 group/stat">
                <Heart className="h-4 w-4 group-hover/stat:text-red-500 transition-colors duration-200" />
                <span className="font-medium">{likes.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 group/stat">
                <MessageCircle className="h-4 w-4 group-hover/stat:text-blue-500 transition-colors duration-200" />
                <span className="font-medium">{comments.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-1 group/stat">
                <Eye className="h-4 w-4 group-hover/stat:text-green-500 transition-colors duration-200" />
                <span className="font-medium">{views.toLocaleString()}</span>
              </div>
            </div>
            
            {/* Read More Indicator */}
            <div className="flex items-center space-x-1 text-blue-600 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <span>Read more</span>
              <BookOpen className="h-3 w-3" />
            </div>
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default BlogCard;