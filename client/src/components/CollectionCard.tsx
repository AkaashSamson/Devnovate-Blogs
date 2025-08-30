import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  Users, 
  Clock, 
  TrendingUp, 
  MoreVertical,
  Play,
  Edit,
  Share2
} from 'lucide-react';
import { DevCollection } from '@/types/collections';
import { cn } from '@/lib/utils';

interface CollectionCardProps {
  collection: DevCollection;
  onView?: (collection: DevCollection) => void;
  onEdit?: (collection: DevCollection) => void;
  onShare?: (collection: DevCollection) => void;
  onDelete?: (collection: DevCollection) => void;
  showActions?: boolean;
  className?: string;
}

const CollectionCard: React.FC<CollectionCardProps> = ({
  collection,
  onView,
  onEdit,
  onShare,
  onDelete,
  showActions = true,
  className
}) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 cursor-pointer",
      "border-2 hover:border-primary/20",
      className
    )}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center text-2xl">
              {collection.name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-lg truncate group-hover:text-primary transition-colors">
                {collection.name}
              </h3>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {collection.description}
              </p>
            </div>
          </div>
          
          {showActions && (
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit?.(collection);
                }}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onShare?.(collection);
                }}
              >
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Tags */}
        <div className="flex flex-wrap gap-1">
          {collection.tags.slice(0, 4).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {collection.tags.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{collection.tags.length - 4} more
            </Badge>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{collection.articleCount}</span>
            <span className="text-muted-foreground">articles</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{collection.followers}</span>
            <span className="text-muted-foreground">followers</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">
              {collection.estimatedTime ? formatTime(collection.estimatedTime) : 'N/A'}
            </span>
          </div>
        </div>

        {/* Progress */}
        {collection.readingProgress !== undefined && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Reading Progress</span>
              <span className="font-medium">{Math.round(collection.readingProgress)}%</span>
            </div>
            <Progress value={collection.readingProgress} className="h-2" />
          </div>
        )}

        {/* Difficulty Badge */}
        {collection.difficulty && (
          <div className="flex items-center justify-between">
            <Badge className={getDifficultyColor(collection.difficulty)}>
              {collection.difficulty.charAt(0).toUpperCase() + collection.difficulty.slice(1)}
            </Badge>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <TrendingUp className="h-3 w-3" />
              <span>Updated {new Date(collection.updatedAt).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button 
          className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
          onClick={() => onView?.(collection)}
        >
          <Play className="h-4 w-4 mr-2" />
          {collection.readingProgress && collection.readingProgress > 0 ? 'Continue Reading' : 'Start Reading'}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CollectionCard;
