import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  FileText, 
  TrendingUp, 
  Shield, 
  Check, 
  X, 
  Eye, 
  EyeOff,
  Trash2,
  Clock
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const AdminDashboard = () => {
  const { toast } = useToast();
  const { backendUrl, isAdmin } = useAppContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  
  const [pendingArticles, setPendingArticles] = useState([]);

  // Fetch pending articles from API
  useEffect(() => {
    const fetchPendingArticles = async () => {
      if (!isAdmin) return;
      
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/blogs/pending`);
        
        if (response.data.success) {
          setPendingArticles(response.data.blogs);
        }
      } catch (error) {
        console.error('Error fetching pending articles:', error);
        toast({
          title: "Error",
          description: "Failed to load pending articles.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPendingArticles();
  }, [backendUrl, isAdmin, toast]);

  const stats = {
    totalUsers: 10247,
    totalArticles: 25630,
    pendingReviews: pendingArticles.length,
    monthlyViews: 450000
  };

  const handleApprove = async (articleId: string) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${backendUrl}/blogs/${articleId}/approve`);
      
      setPendingArticles(prev => prev.filter(article => article.id !== articleId));
      toast({
        title: "Article approved",
        description: "The article has been published successfully.",
      });
    } catch (error) {
      console.error('Error approving article:', error);
      toast({
        title: "Error",
        description: "Failed to approve article.",
        variant: "destructive",
      });
    }
  };

  const handleReject = async (articleId: string) => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${backendUrl}/blogs/${articleId}/reject`);
      
      setPendingArticles(prev => prev.filter(article => article.id !== articleId));
      toast({
        title: "Article rejected",
        description: "The author has been notified of the rejection.",
        variant: "destructive"
      });
    } catch (error) {
      console.error('Error rejecting article:', error);
      toast({
        title: "Error", 
        description: "Failed to reject article.",
        variant: "destructive",
      });
    }
  };

  const handlePreview = (articleId: string) => {
    // Navigate to dedicated blog preview page
    navigate(`/admin/preview/${articleId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-muted-foreground">
              Manage content and users on Devnovate
            </p>
          </div>
          <Badge variant="default" className="bg-gradient-primary">
            <Shield className="h-4 w-4 mr-2" />
            Admin
          </Badge>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="p-6 bg-gradient-card shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Users</div>
              </div>
              <Users className="h-8 w-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.totalArticles.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Articles</div>
              </div>
              <FileText className="h-8 w-8 text-primary" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold text-orange-500">{stats.pendingReviews}</div>
                <div className="text-sm text-muted-foreground">Pending Reviews</div>
              </div>
              <Clock className="h-8 w-8 text-orange-500" />
            </div>
          </Card>
          
          <Card className="p-6 bg-gradient-card shadow-soft">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{stats.monthlyViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Monthly Views</div>
              </div>
              <TrendingUp className="h-8 w-8 text-primary" />
            </div>
          </Card>
        </div>

        {/* Content Management */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending Reviews ({stats.pendingReviews})
            </TabsTrigger>
            <TabsTrigger value="published" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Published Articles
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              User Management
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="pending" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Articles Pending Review</h2>
              <Badge variant="secondary">
                {pendingArticles.length} articles awaiting approval
              </Badge>
            </div>
            
            <div className="space-y-4">
              {pendingArticles.map((article) => (
                <Card key={article.id} className="p-6 bg-gradient-card shadow-soft">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold">{article.title}</h3>
                        <Badge variant="secondary">Pending</Badge>
                      </div>
                      
                      <p className="text-muted-foreground mb-4 line-clamp-2">
                        {article.excerpt}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mb-4">
                        {article.tags.map((tag) => (
                          <Badge key={tag} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={article.author.avatar} />
                            <AvatarFallback>
                              {article.author.name.split(' ').map(n => n[0]).join('')}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="text-sm font-medium">{article.author.name}</p>
                            <p className="text-xs text-muted-foreground">
                              Submitted {article.submittedAt} • {article.wordCount} words
                            </p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePreview(article.id)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Preview
                          </Button>
                          <Button 
                            variant="default" 
                            size="sm"
                            onClick={() => handleApprove(article.id)}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            Approve
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="sm"
                            onClick={() => handleReject(article.id)}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              
              {pendingArticles.length === 0 && (
                <Card className="p-12 text-center bg-gradient-card shadow-soft">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">All caught up!</h3>
                  <p className="text-muted-foreground">
                    No articles are currently pending review.
                  </p>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="published" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Published Articles Management</h2>
              <Button variant="outline">
                <EyeOff className="h-4 w-4 mr-2" />
                Bulk Actions
              </Button>
            </div>
            
            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="text-center">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Published Articles</h3>
                <p className="text-muted-foreground">
                  Manage visibility and moderate published content
                </p>
                <Button variant="outline" className="mt-4">
                  View All Published Articles
                </Button>
              </div>
            </Card>
          </TabsContent>
          
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">User Management</h2>
              <Button variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Export Users
              </Button>
            </div>
            
            <Card className="p-6 bg-gradient-card shadow-soft">
              <div className="text-center">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">User Administration</h3>
                <p className="text-muted-foreground">
                  Manage user accounts, permissions, and moderation
                </p>
                <Button variant="outline" className="mt-4">
                  View All Users
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;