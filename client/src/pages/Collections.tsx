import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Sparkles,
  BookOpen,
  Users,
  Clock,
  TrendingUp,
  Settings,
  MoreVertical
} from 'lucide-react';
import { DevCollection } from '@/types/collections';
import { collectionTemplates } from '@/data/collectionTemplates';
import CollectionCard from '@/components/CollectionCard';
import CollectionBuilder from '@/components/CollectionBuilder';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration
const mockCollections: DevCollection[] = [
  {
    id: '1',
    name: 'DevOps Mastery',
    description: 'Master containerization, CI/CD, and cloud deployment',
    tags: ['Docker', 'Kubernetes', 'CI/CD', 'AWS', 'Linux', 'DevOps'],
    isPublic: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-20'),
    articleCount: 127,
    followers: 2340,
    createdBy: 'user-1',
    color: '#667eea',
    layout: 'grid',
    readingProgress: 45,
    estimatedTime: 720,
    difficulty: 'intermediate'
  },
  {
    id: '2',
    name: 'AI & ML Journey',
    description: 'Explore artificial intelligence and machine learning',
    tags: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'NLP'],
    isPublic: true,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-18'),
    articleCount: 89,
    followers: 1567,
    createdBy: 'user-1',
    color: '#f093fb',
    layout: 'grid',
    readingProgress: 12,
    estimatedTime: 900,
    difficulty: 'intermediate'
  },
  {
    id: '3',
    name: 'Frontend Fundamentals',
    description: 'Master the basics of modern web development',
    tags: ['HTML', 'CSS', 'JavaScript', 'React', 'TypeScript', 'Web Development'],
    isPublic: false,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-12'),
    articleCount: 156,
    followers: 0,
    createdBy: 'user-1',
    color: '#4facfe',
    layout: 'list',
    readingProgress: 78,
    estimatedTime: 480,
    difficulty: 'beginner'
  }
];

const Collections: React.FC = () => {
  const [collections, setCollections] = useState<DevCollection[]>(mockCollections);
  const [filteredCollections, setFilteredCollections] = useState<DevCollection[]>(mockCollections);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<DevCollection | undefined>();
  const { toast } = useToast();

  // Filter collections based on search and filters
  useEffect(() => {
    let filtered = collections;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(collection =>
        collection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        collection.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(collection => {
        const template = collectionTemplates.find(t => t.category === selectedCategory);
        return template && collection.tags.some(tag => template.tags.includes(tag));
      });
    }

    // Difficulty filter
    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(collection => collection.difficulty === selectedDifficulty);
    }

    setFilteredCollections(filtered);
  }, [collections, searchTerm, selectedCategory, selectedDifficulty]);

  const handleCreateCollection = () => {
    setEditingCollection(undefined);
    setIsBuilderOpen(true);
  };

  const handleEditCollection = (collection: DevCollection) => {
    setEditingCollection(collection);
    setIsBuilderOpen(true);
  };

  const handleSaveCollection = (collectionData: Partial<DevCollection>) => {
    if (editingCollection) {
      // Update existing collection
      setCollections(prev => prev.map(c => 
        c.id === editingCollection.id 
          ? { ...c, ...collectionData, updatedAt: new Date() }
          : c
      ));
      toast({
        title: "Collection Updated",
        description: "Your collection has been updated successfully.",
      });
    } else {
      // Create new collection
      const newCollection: DevCollection = {
        ...collectionData,
        id: `collection-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        articleCount: 0,
        followers: 0,
        createdBy: 'current-user-id'
      } as DevCollection;
      
      setCollections(prev => [newCollection, ...prev]);
      toast({
        title: "Collection Created",
        description: "Your new collection has been created successfully.",
      });
    }
  };

  const handleDeleteCollection = (collection: DevCollection) => {
    setCollections(prev => prev.filter(c => c.id !== collection.id));
    toast({
      title: "Collection Deleted",
      description: "The collection has been deleted successfully.",
    });
  };

  const handleViewCollection = (collection: DevCollection) => {
    // Navigate to collection view page
    console.log('Viewing collection:', collection.name);
  };

  const getStats = () => {
    const totalCollections = collections.length;
    const publicCollections = collections.filter(c => c.isPublic).length;
    const totalArticles = collections.reduce((sum, c) => sum + c.articleCount, 0);
    const totalFollowers = collections.reduce((sum, c) => sum + c.followers, 0);
    const totalReadingTime = collections.reduce((sum, c) => sum + (c.estimatedTime || 0), 0);

    return { totalCollections, publicCollections, totalArticles, totalFollowers, totalReadingTime };
  };

  const stats = getStats();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">My Collections</h1>
              <p className="text-muted-foreground mt-1">
                Organize and curate your learning journey
              </p>
            </div>
            <Button onClick={handleCreateCollection} className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Create Collection</span>
            </Button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Collections</p>
                    <p className="text-xl font-bold">{stats.totalCollections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Public</p>
                    <p className="text-xl font-bold">{stats.publicCollections}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Articles</p>
                    <p className="text-xl font-bold">{stats.totalArticles}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Followers</p>
                    <p className="text-xl font-bold">{stats.totalFollowers}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Reading Time</p>
                    <p className="text-xl font-bold">{Math.floor(stats.totalReadingTime / 60)}h</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search collections..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex gap-2">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="frontend">Frontend</SelectItem>
                <SelectItem value="backend">Backend</SelectItem>
                <SelectItem value="devops">DevOps</SelectItem>
                <SelectItem value="ai-ml">AI & ML</SelectItem>
                <SelectItem value="game-dev">Game Dev</SelectItem>
                <SelectItem value="mobile">Mobile</SelectItem>
                <SelectItem value="data-science">Data Science</SelectItem>
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>

            <div className="flex border rounded-md">
              <Button
                variant={layout === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayout('grid')}
              >
                <Grid3X3 className="h-4 w-4" />
              </Button>
              <Button
                variant={layout === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setLayout('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Collections Grid/List */}
        {filteredCollections.length === 0 ? (
          <div className="text-center py-12">
            <Sparkles className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No collections found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all'
                ? 'Try adjusting your filters or search terms.'
                : 'Create your first collection to get started!'}
            </p>
            {!searchTerm && selectedCategory === 'all' && selectedDifficulty === 'all' && (
              <Button onClick={handleCreateCollection}>
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Collection
              </Button>
            )}
          </div>
        ) : (
          <div className={layout === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
          }>
            {filteredCollections.map((collection) => (
              <CollectionCard
                key={collection.id}
                collection={collection}
                onView={handleViewCollection}
                onEdit={handleEditCollection}
                onDelete={handleDeleteCollection}
                className={layout === 'list' ? "flex-row" : ""}
              />
            ))}
          </div>
        )}
      </div>

      {/* Collection Builder Modal */}
      <CollectionBuilder
        isOpen={isBuilderOpen}
        onClose={() => setIsBuilderOpen(false)}
        onSave={handleSaveCollection}
        collection={editingCollection}
        mode={editingCollection ? 'edit' : 'create'}
      />
    </div>
  );
};

export default Collections;
