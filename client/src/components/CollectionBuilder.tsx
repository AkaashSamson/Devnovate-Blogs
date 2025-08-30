import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  X, 
  Plus, 
  Search, 
  Sparkles, 
  Settings,
  Palette,
  Eye,
  Users
} from 'lucide-react';
import { DevCollection, CollectionTemplate } from '@/types/collections';
import { collectionTemplates } from '@/data/collectionTemplates';
import { cn } from '@/lib/utils';

interface CollectionBuilderProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (collection: Partial<DevCollection>) => void;
  collection?: DevCollection;
  mode: 'create' | 'edit';
}

const availableTags = [
  'React', 'Vue.js', 'Angular', 'TypeScript', 'JavaScript', 'Node.js', 'Python', 'Java', 'C#',
  'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'CI/CD', 'Linux', 'DevOps', 'Microservices',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'GraphQL', 'REST', 'API Design', 'System Design',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Computer Vision', 'NLP',
  'Unity', 'Unreal Engine', 'Game Design', '3D Modeling', 'Mobile Development', 'Flutter',
  'React Native', 'iOS', 'Android', 'Data Science', 'Data Analysis', 'Statistics',
  'Frontend', 'Backend', 'Full Stack', 'Web Development', 'Mobile Development', 'Game Development'
];

const CollectionBuilder: React.FC<CollectionBuilderProps> = ({
  isOpen,
  onClose,
  onSave,
  collection,
  mode
}) => {
  const [formData, setFormData] = useState({
    name: collection?.name || '',
    description: collection?.description || '',
    tags: collection?.tags || [],
    isPublic: collection?.isPublic ?? true,
    difficulty: collection?.difficulty || 'intermediate',
    color: collection?.color || '#667eea',
    layout: collection?.layout || 'grid'
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<CollectionTemplate | null>(null);

  const filteredTags = availableTags.filter(tag =>
    tag.toLowerCase().includes(searchTerm.toLowerCase()) &&
    !formData.tags.includes(tag)
  );

  const handleAddTag = (tag: string) => {
    if (!formData.tags.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tag]
      }));
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleTemplateSelect = (template: CollectionTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      name: template.name,
      description: template.description,
      tags: template.tags,
      difficulty: template.difficulty
    }));
  };

  const handleSave = () => {
    if (!formData.name.trim() || formData.tags.length === 0) {
      return; // Add proper validation/error handling
    }

    const newCollection: Partial<DevCollection> = {
      ...formData,
      id: collection?.id || `collection-${Date.now()}`,
      createdAt: collection?.createdAt || new Date(),
      updatedAt: new Date(),
      articleCount: collection?.articleCount || 0,
      followers: collection?.followers || 0,
      createdBy: collection?.createdBy || 'current-user-id'
    };

    onSave(newCollection);
    onClose();
  };

  const getTagSuggestions = (currentTags: string[]) => {
    // Simple suggestion logic - in a real app, this would be AI-powered
    const suggestions: string[] = [];
    
    if (currentTags.includes('React')) {
      suggestions.push('TypeScript', 'JavaScript', 'Frontend');
    }
    if (currentTags.includes('Docker')) {
      suggestions.push('Kubernetes', 'DevOps', 'CI/CD');
    }
    if (currentTags.includes('Python')) {
      suggestions.push('Machine Learning', 'Data Science', 'Django');
    }
    
    return suggestions.filter(suggestion => 
      !currentTags.includes(suggestion) && 
      !formData.tags.includes(suggestion)
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>{mode === 'create' ? 'Create New Collection' : 'Edit Collection'}</span>
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="templates">Templates</TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
            <TabsTrigger value="customize">Customize</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Collection Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., DevOps Mastery, AI & ML Journey"
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe what this collection is about..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="difficulty">Difficulty Level</Label>
                <Select
                  value={formData.difficulty}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, difficulty: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="beginner">Beginner</SelectItem>
                    <SelectItem value="intermediate">Intermediate</SelectItem>
                    <SelectItem value="advanced">Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="public"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublic: checked }))}
                />
                <Label htmlFor="public" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>Make this collection public</span>
                </Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="templates" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {collectionTemplates.map((template) => (
                <Card
                  key={template.id}
                  className={cn(
                    "cursor-pointer transition-all duration-200 hover:shadow-md",
                    selectedTemplate?.id === template.id && "ring-2 ring-primary"
                  )}
                  onClick={() => handleTemplateSelect(template)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="text-3xl">{template.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{template.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{template.description}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-1 mb-3">
                      {template.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {template.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{template.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="capitalize">{template.difficulty}</span>
                      <span className="text-muted-foreground">
                        ~{Math.floor(template.estimatedTime / 60)}h
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tags" className="space-y-4">
            <div className="space-y-4">
              {/* Current Tags */}
              <div>
                <Label>Selected Tags ({formData.tags.length})</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map((tag) => (
                    <Badge key={tag} variant="default" className="flex items-center space-x-1">
                      <span>{tag}</span>
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-primary/20 rounded-full p-0.5"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Tag Suggestions */}
              {formData.tags.length > 0 && (
                <div>
                  <Label className="flex items-center space-x-2">
                    <Sparkles className="h-4 w-4" />
                    <span>Suggested Tags</span>
                  </Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {getTagSuggestions(formData.tags).slice(0, 6).map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="cursor-pointer hover:bg-primary/10"
                        onClick={() => handleAddTag(tag)}
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Tag Search */}
              <div>
                <Label>Add More Tags</Label>
                <div className="relative mt-2">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-wrap gap-2 mt-3 max-h-40 overflow-y-auto">
                  {filteredTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="cursor-pointer hover:bg-primary/10"
                      onClick={() => handleAddTag(tag)}
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="customize" className="space-y-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="color">Collection Color</Label>
                <div className="flex items-center space-x-3 mt-2">
                  <input
                    type="color"
                    value={formData.color}
                    onChange={(e) => setFormData(prev => ({ ...prev, color: e.target.value }))}
                    className="w-12 h-12 rounded-lg border cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">
                    This color will be used for the collection theme
                  </span>
                </div>
              </div>

              <div>
                <Label htmlFor="layout">Default Layout</Label>
                <Select
                  value={formData.layout}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, layout: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="grid">Grid View</SelectItem>
                    <SelectItem value="list">List View</SelectItem>
                    <SelectItem value="magazine">Magazine View</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!formData.name.trim() || formData.tags.length === 0}>
            {mode === 'create' ? 'Create Collection' : 'Save Changes'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CollectionBuilder;
