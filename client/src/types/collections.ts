export interface DevCollection {
  id: string;
  name: string;
  description: string;
  tags: string[];
  isPublic: boolean;
  coverImage?: string;
  createdAt: Date;
  updatedAt: Date;
  articleCount: number;
  followers: number;
  createdBy: string;
  color?: string;
  layout?: 'grid' | 'list' | 'magazine';
  readingProgress?: number;
  estimatedTime?: number; // in minutes
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
}

export interface CollectionTemplate {
  id: string;
  name: string;
  description: string;
  tags: string[];
  category: 'frontend' | 'backend' | 'devops' | 'ai-ml' | 'mobile' | 'game-dev' | 'data-science' | 'system-design';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: number;
  icon: string;
}

export interface CollectionStats {
  totalArticles: number;
  readArticles: number;
  readingProgress: number;
  timeSpent: number; // in minutes
  lastReadAt?: Date;
  averageRating?: number;
}

export interface TagSuggestion {
  tag: string;
  confidence: number;
  relatedTags: string[];
  articleCount: number;
}

export interface CollectionFilters {
  tags: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  readingTime?: {
    min: number;
    max: number;
  };
  matchType: 'all' | 'any'; // all tags must match vs any tag can match
}
