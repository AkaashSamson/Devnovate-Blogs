import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Send, Eye, X, Edit, Upload, Image, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios, { AxiosError } from "axios";

const Write = () => {
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("# Your Article Title\n\nStart writing your markdown content here...\n\n## Introduction\n\nYour introduction text goes here.\n\n## Main Content\n\n- **Bold text**\n- *Italic text*\n- [Links](https://example.com)\n- `Code snippets`\n\n```javascript\nconst example = \"Hello, World!\";\nconsole.log(example);\n```\n\n> This is a blockquote for important information\n\n## Conclusion\n\nYour conclusion goes here.");
  const [tags, setTags] = useState<string[]>([]);
  const [currentTag, setCurrentTag] = useState("");
  const [featuredImage, setFeaturedImage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("edit");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  
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

  // Image upload functionality
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file (JPEG, PNG, GIF, etc.)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await axios.post(`${backendUrl}/upload/image`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.success) {
        const imageUrl = response.data.url;
        const markdownImage = `![${file.name}](${imageUrl})`;
        
        // Insert at cursor position or append to content
        setContent(prev => prev + '\n' + markdownImage);
        
        toast({
          title: "Image uploaded successfully",
          description: "Image has been inserted into your content",
        });
      }
    } catch (error: unknown) {
      console.error('Image upload error:', error);
      let message = "Failed to upload image";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || "Failed to upload image";
      }
      toast({
        title: "Upload failed",
        description: message,
        variant: "destructive",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      await handleImageUpload(imageFile);
    } else {
      toast({
        title: "Invalid file type",
        description: "Please drop an image file",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
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
    } catch (error: unknown) {
      console.error('Save draft error:', error);
      let message = "Failed to save draft";
      if (error instanceof AxiosError) {
        message = error.response?.data?.message || "Failed to save draft";
      }
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
    } catch (error: unknown) {
      console.error('Submit error:', error);
      let msg = "Failed to submit article";
      if (error instanceof AxiosError) {
        msg = error.response?.data?.message || "Failed to submit article";
      }
      toast({
        title: "Error submitting article",
        description: msg,
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

                {/* Content with Markdown Editor */}
                <div>
                  <Label htmlFor="content" className="text-base font-semibold">Content</Label>
                  
                  {/* Image Upload Toolbar */}
                  <div className="mt-2 mb-3 flex items-center gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                      id="image-upload"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={uploadingImage}
                      className="cursor-pointer"
                      onClick={() => {
                        const input = document.getElementById('image-upload') as HTMLInputElement;
                        if (input) {
                          input.click();
                        }
                      }}
                    >
                      {uploadingImage ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Upload className="h-4 w-4 mr-2" />
                      )}
                      {uploadingImage ? "Uploading..." : "Upload Image"}
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      or drag & drop images here
                    </span>
                  </div>

                  <div className="mt-2">
                    <Card className={`h-[600px] ${isDragOver ? 'ring-2 ring-blue-500 bg-blue-50/50' : ''}`}>
                      <div className="p-4 border-b">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                          <TabsList className="grid w-full grid-cols-2">
                            <TabsTrigger value="edit" className="flex items-center gap-2">
                              <Edit className="h-4 w-4" />
                              Edit
                            </TabsTrigger>
                            <TabsTrigger value="preview" className="flex items-center gap-2">
                              <Eye className="h-4 w-4" />
                              Preview
                            </TabsTrigger>
                          </TabsList>
                        </Tabs>
                      </div>
                      <div className="h-[calc(100%-80px)]">
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
                          <TabsContent value="edit" className="h-full p-4 pt-0 mt-0 relative">
                            {isDragOver && (
                              <div className="absolute inset-0 bg-blue-500/10 border-2 border-dashed border-blue-500 rounded-lg flex items-center justify-center z-10">
                                <div className="text-center">
                                  <Image className="h-12 w-12 text-blue-500 mx-auto mb-2" />
                                  <p className="text-blue-600 font-medium">Drop your image here</p>
                                  <p className="text-blue-500 text-sm">It will be automatically uploaded and inserted</p>
                                </div>
                              </div>
                            )}
                            <Textarea
                              id="content"
                              placeholder="Write your article content in markdown...&#10;&#10;💡 Tip: You can drag and drop images here or use the upload button above!"
                              value={content}
                              onChange={(e) => setContent(e.target.value)}
                              onDrop={handleDrop}
                              onDragOver={handleDragOver}
                              onDragLeave={handleDragLeave}
                              className="h-full min-h-[500px] resize-none font-mono text-sm border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                            />
                          </TabsContent>
                          
                          <TabsContent value="preview" className="h-full p-4 pt-0 mt-0 overflow-auto">
                            <div className="prose prose-neutral dark:prose-invert max-w-none">
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {content || 'Nothing to preview yet. Start writing in the Edit tab!'}
                              </ReactMarkdown>
                            </div>
                          </TabsContent>
                        </Tabs>
                      </div>
                    </Card>
                  </div>
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
                  variant="default" 
                  className="w-full"
                  disabled={isSubmitting || !isLoggedIn}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isSubmitting ? "Submitting..." : "Submit for Review"}
                </Button>
                <Button 
                  variant="ghost" 
                  className="w-full" 
                  disabled={isSubmitting}
                  onClick={() => setActiveTab('preview')}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Preview
                </Button>
              </div>
            </Card>

            {/* Image Upload Help */}
            <Card className="p-6 bg-gradient-card shadow-soft">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Image className="h-4 w-4" />
                Image Upload
              </h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Click "Upload Image" or drag & drop images</li>
                <li>• Supported formats: JPEG, PNG, GIF, WebP</li>
                <li>• Maximum file size: 5MB</li>
                <li>• Images are automatically inserted as markdown</li>
                <li>• You can also paste image URLs directly</li>
              </ul>
            </Card>

            {/* Guidelines */}
            <Card className="p-6 bg-gradient-card shadow-soft">
              <h3 className="font-semibold mb-4">Writing Guidelines</h3>
              <ul className="text-sm text-muted-foreground space-y-2">
                <li>• Keep your title clear and descriptive</li>
                <li>• Add relevant tags to help readers find your article</li>
                <li>• Write a compelling excerpt</li>
                <li>• Use markdown formatting and code blocks</li>
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