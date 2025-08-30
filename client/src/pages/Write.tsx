import { useState } from "react";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Send, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Write = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const { toast } = useToast();

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && currentTag.trim()) {
      e.preventDefault();
      if (!tags.includes(currentTag.trim())) {
        setTags([...tags, currentTag.trim()]);
      }
      setCurrentTag("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };

  const handleSaveDraft = () => {
    toast({
      title: "Draft saved",
      description: "Your article has been saved as a draft.",
    });
  };

  const handleSubmitForReview = () => {
    if (!title || !content) {
      toast({
        title: "Missing information",
        description: "Please add a title and content before submitting.",
        variant: "destructive",
      });
      return;
    }
    
    toast({
      title: "Article submitted",
      description: "Your article has been submitted for admin review.",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Write New Article</h1>
          <p className="text-muted-foreground">
            Share your knowledge with the developer community
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Editor */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title" className="text-base font-semibold">Article Title</Label>
                  <Input
                    id="title"
                    placeholder="Enter your article title..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-2 text-lg h-12"
                  />
                </div>

                {/* Excerpt */}
                <div>
                  <Label htmlFor="excerpt" className="text-base font-semibold">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    placeholder="Write a brief description of your article..."
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    className="mt-2"
                    rows={3}
                  />
                </div>

                {/* Tags */}
                <div>
                  <Label htmlFor="tags" className="text-base font-semibold">Tags</Label>
                  <div className="mt-2 space-y-3">
                    <Input
                      id="tags"
                      placeholder="Add tags (press Enter to add)"
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      onKeyDown={handleAddTag}
                    />
                    <div className="flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="px-3 py-1">
                          {tag}
                          <button
                            onClick={() => removeTag(tag)}
                            className="ml-2 hover:text-destructive"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                  <Textarea
                    id="content"
                    placeholder="Write your article content here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className="mt-2 min-h-96"
                    rows={20}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Actions */}
            <Card className="p-6 bg-gradient-card shadow-soft">
              <h3 className="font-semibold mb-4">Publish Settings</h3>
              <div className="space-y-3">
                <Button 
                  onClick={handleSaveDraft} 
                  variant="outline" 
                  className="w-full"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Draft
                </Button>
                <Button 
                  onClick={handleSubmitForReview}
                  variant="gradient" 
                  className="w-full"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Submit for Review
                </Button>
                <Button variant="ghost" className="w-full">
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </Card>

            {/* Guidelines */}
            <Card className="p-6 bg-gradient-card shadow-soft">
              <h3 className="font-semibold mb-4">Writing Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Keep your title clear and descriptive</li>
                <li>• Add relevant tags to help readers find your article</li>
                <li>• Write a compelling excerpt</li>
                <li>• Use proper formatting and code blocks</li>
                <li>• Include examples and practical insights</li>
                <li>• All articles are reviewed before publishing</li>
              </ul>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Write;