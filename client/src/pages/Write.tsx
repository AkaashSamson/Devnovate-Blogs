import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Save, Send, Eye, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const Write = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const { isLoggedIn, user, backendUrl, loading } = useAppContext();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to write an article.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [isLoggedIn, loading, navigate, toast]);

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

  const handleSaveDraft = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to save drafts.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      toast({
        title: "Missing information",
        description: "Please add title, excerpt, and content to save draft.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      axios.defaults.withCredentials = true;
      const blogData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        tags,
        featured_image: featuredImage.trim() || undefined,
      };

      const response = await axios.post(`${backendUrl}/blogs`, blogData);
      
      if (response.data.success) {
        toast({
          title: "Draft saved",
          description: "Your article has been saved as a draft and is pending review.",
        });
        // Clear form or navigate as needed
        setTitle("");
        setExcerpt("");
        setContent("");
        setTags([]);
        setFeaturedImage("");
      }
    } catch (error: any) {
      console.error('Save draft error:', error);
      const message = error?.response?.data?.message || "Failed to save draft";
      toast({
        title: "Error saving draft",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitForReview = async () => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to submit articles.",
        variant: "destructive",
      });
      return;
    }

    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      toast({
        title: "Missing information",
        description: "Please add title, excerpt, and content before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      axios.defaults.withCredentials = true;
      const blogData = {
        title: title.trim(),
        excerpt: excerpt.trim(),
        content: content.trim(),
        tags,
        featured_image: featuredImage.trim() || undefined,
      };

      const response = await axios.post(`${backendUrl}/blogs`, blogData);
      
      if (response.data.success) {
        toast({
          title: "Article submitted",
          description: "Your article has been submitted for admin review.",
        });
        // Navigate to home or profile page
        navigate("/");
      }
    } catch (error: any) {
      console.error('Submit error:', error);
      const message = error?.response?.data?.message || "Failed to submit article";
      toast({
        title: "Error submitting article",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render the form if not logged in (will redirect)
  if (!isLoggedIn && !loading) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Write New Article</h1>
          <p className="text-muted-foreground">
            Share your knowledge with the developer community
            {user && (
              <span className="ml-2 text-primary">
                • Writing as {user.name}
              </span>
            )}
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

                {/* Featured Image */}
                <div>
                  <Label htmlFor="featured-image" className="text-base font-semibold">
                    Featured Image URL (Optional)
                  </Label>
                  <Input
                    id="featured-image"
                    placeholder="https://example.com/image.jpg"
                    value={featuredImage}
                    onChange={(e) => setFeaturedImage(e.target.value)}
                    className="mt-2"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    Add a URL to an image that represents your article
                  </p>
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
                  disabled={isSubmitting || !isLoggedIn}
                >
                  <Save className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Saving..." : "Save Draft"}
                </Button>
                <Button 
                  onClick={handleSubmitForReview}
                  variant="gradient" 
                  className="w-full"
                  disabled={isSubmitting || !isLoggedIn}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
                <Button variant="ghost" className="w-full" disabled={isSubmitting}>
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