import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Card } from "@/components/ui/card";
import { AlertCircle, Calendar, Eye, ArrowLeft, Check, X } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import axios from "axios";

const BlogPreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState(false);
  const [rejecting, setRejecting] = useState(false);
  
  const { backendUrl, isAdmin } = useAppContext();
  const { toast } = useToast();

  // Redirect non-admins
  useEffect(() => {
    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [isAdmin, navigate]);

  // Fetch pending blog data
  useEffect(() => {
    const fetchPendingBlog = async () => {
      if (!id || !isAdmin) return;
      
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/blogs/pending/${id}`);
        
        if (response.data.success) {
          const blogData = response.data.blog;
          setPost({
            id: blogData.id,
            title: blogData.title,
            content: blogData.content,
            excerpt: blogData.excerpt,
            author: blogData.author,
            submittedAt: blogData.submittedAt,
            wordCount: blogData.wordCount,
            tags: blogData.tags || [],
            coverImage: blogData.featured_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=600&fit=crop",
            status: blogData.status
          });
        }
      } catch (error) {
        console.error('Error fetching pending blog:', error);
        toast({
          title: "Error",
          description: "Failed to load article preview.",
          variant: "destructive",
        });
        navigate('/admin-dashboard');
      } finally {
        setLoading(false);
      }
    };

    fetchPendingBlog();
  }, [id, backendUrl, isAdmin, toast, navigate]);

  const handleApprove = async () => {
    if (!post) return;
    
    setApproving(true);
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${backendUrl}/blogs/${post.id}/approve`);
      
      toast({
        title: "Article approved",
        description: "The article has been published successfully.",
      });
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error approving article:', error);
      toast({
        title: "Error",
        description: "Failed to approve article.",
        variant: "destructive",
      });
    } finally {
      setApproving(false);
    }
  };

  const handleReject = async () => {
    if (!post) return;
    
    setRejecting(true);
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${backendUrl}/blogs/${post.id}/reject`);
      
      toast({
        title: "Article rejected",
        description: "The author has been notified of the rejection.",
        variant: "destructive"
      });
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Error rejecting article:', error);
      toast({
        title: "Error", 
        description: "Failed to reject article.",
        variant: "destructive",
      });
    } finally {
      setRejecting(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Admin Preview Banner */}
      <div className="bg-orange-100 dark:bg-orange-900/20 border-b border-orange-200 dark:border-orange-800">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-orange-800 dark:text-orange-200">
              <AlertCircle className="h-4 w-4" />
              <span className="font-medium">Admin Preview Mode</span>
              <span className="text-sm">This article is pending approval</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => navigate('/admin-dashboard')}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
              <Button 
                variant="default" 
                size="sm"
                onClick={handleApprove}
                disabled={approving || !post}
              >
                <Check className="h-4 w-4 mr-2" />
                {approving ? "Approving..." : "Approve"}
              </Button>
              <Button 
                variant="destructive" 
                size="sm"
                onClick={handleReject}
                disabled={rejecting || !post}
              >
                <X className="h-4 w-4 mr-2" />
                {rejecting ? "Rejecting..." : "Reject"}
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {loading ? (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading article preview...</p>
            </div>
          </div>
        </div>
      ) : !post ? (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Article Preview Not Available</h1>
            <p className="text-muted-foreground">
              The article you're trying to preview may have been approved, rejected, or removed.
            </p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => navigate('/admin-dashboard')}
            >
              Go Back to Admin Dashboard
            </Button>
          </div>
        </div>
      ) : (
        <article className="container mx-auto px-4 py-8 max-w-4xl">
          {/* Article Info Card */}
          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900 dark:text-blue-100">Article Information</h3>
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  Submitted {post.submittedAt} • {post.wordCount} words • Status: {post.status}
                </p>
              </div>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Pending Review
              </Badge>
            </div>
          </Card>

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
                  <span>Submitted {post.submittedAt}</span>
                  <span>•</span>
                  <span>{Math.ceil((post.content?.length || 0) / 1000)} min read</span>
                </div>
              </div>
            </div>
          </header>
          
          <Separator className="mb-8" />
          
          {/* Article Excerpt */}
          {post.excerpt && (
            <>
              <div className="bg-gradient-card p-6 rounded-xl shadow-soft mb-8">
                <h3 className="text-lg font-semibold mb-3">Article Excerpt</h3>
                <p className="text-muted-foreground italic">{post.excerpt}</p>
              </div>
              <Separator className="mb-8" />
            </>
          )}
          
          {/* Article Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            {post.content.includes('#') || post.content.includes('```') ? (
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content}
              </ReactMarkdown>
            ) : (
              <div className="whitespace-pre-wrap leading-relaxed">
                {post.content}
              </div>
            )}
          </div>
          
          <Separator className="my-8" />
          
          {/* Admin Actions Footer */}
          <Card className="p-6 bg-gradient-card shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Review Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Approve this article to publish it, or reject it to send feedback to the author.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/admin-dashboard')}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
                <Button 
                  variant="default" 
                  onClick={handleApprove}
                  disabled={approving}
                >
                  <Check className="h-4 w-4 mr-2" />
                  {approving ? "Approving..." : "Approve Article"}
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={handleReject}
                  disabled={rejecting}
                >
                  <X className="h-4 w-4 mr-2" />
                  {rejecting ? "Rejecting..." : "Reject Article"}
                </Button>
              </div>
            </div>
          </Card>
        </article>
      )}
    </div>
  );
};

export default BlogPreview;
