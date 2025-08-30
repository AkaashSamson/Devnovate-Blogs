import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Edit, Eye, Clock, Heart, MessageCircle, Loader2, User, FileText, Trash2, Shield, MapPin, ExternalLink, Calendar } from "lucide-react";
import BlogCard from "@/components/BlogCard";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Profile = () => {
  const [profileData, setProfileData] = useState<any>(null);
  const [userBlogs, setUserBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { isLoggedIn, user, backendUrl } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to view your profile.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
  }, [isLoggedIn, navigate, toast]);

  // Fetch user profile data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) return;
      
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/users/me`);
        
        if (response.data.success) {
          setProfileData(response.data.user);
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error loading profile",
          description: "Failed to load profile data. Using cached information.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, backendUrl, toast]);

  // Fetch user's own blogs
  useEffect(() => {
    const fetchUserBlogs = async () => {
      if (!isLoggedIn) return;
      
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/blogs/my-blogs`);
        
        if (response.data.success) {
          setUserBlogs(response.data.blogs);
        }
      } catch (error: any) {
        console.error('Error fetching user blogs:', error);
      }
    };

    fetchUserBlogs();
  }, [isLoggedIn, backendUrl]);

  // Create user object with fallbacks to dummy data
  const displayUser = {
    name: profileData?.name || user?.name || "John Doe",
    email: profileData?.email || user?.email || "john.doe@example.com",
    bio: profileData?.bio || "",
    joinedDate: profileData?.createdAt ? new Date(profileData.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "January 2024",
    location: profileData?.location || "",
    website: profileData?.website || "",
    isAdmin: profileData?.isAdmin || false,
    stats: {
      articles: profileData?.stats?.articles || 0,
      totalBlogs: profileData?.stats?.totalBlogs || 0,
      followers: profileData?.stats?.followers || 0,
      following: profileData?.stats?.following || 0,
      totalViews: profileData?.stats?.totalViews || 0,
      totalLikes: profileData?.stats?.totalLikes || 0
    }
  };

  // Separate blogs by status
  const publishedArticles = userBlogs.filter(blog => blog.status === 'approved');
  const draftArticles = userBlogs.filter(blog => blog.status === 'pending');
  const rejectedArticles = userBlogs.filter(blog => blog.status === 'rejected');

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      pending: { label: "Under Review", variant: "secondary" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
      approved: { label: "Published", variant: "default" as const }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading profile...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="p-8 bg-gradient-card shadow-medium">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="h-24 w-24">
                <AvatarFallback className="text-2xl bg-muted">
                  <User className="h-12 w-12" />
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">{displayUser.name}</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link to="/profile/edit">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit Profile
                      </Link>
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                {displayUser.bio ? (
                  <p className="text-muted-foreground mb-4 max-w-2xl">{displayUser.bio}</p>
                ) : (
                  <p className="text-muted-foreground/60 mb-4 max-w-2xl italic">
                    No bio available. <Link to="/profile/edit" className="text-primary hover:underline">Add one</Link>
                  </p>
                )}
                
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="ml-2 font-medium">{displayUser.joinedDate}</span>
                  </div>
                  {displayUser.location && (
                    <div>
                      <span className="text-muted-foreground">Location:</span>
                      <span className="ml-2 font-medium">{displayUser.location}</span>
                    </div>
                  )}
                  {displayUser.website && (
                    <div>
                      <span className="text-muted-foreground">Website:</span>
                      <span className="ml-2 font-medium text-primary">{displayUser.website}</span>
                    </div>
                  )}
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <span className="ml-2 font-medium">{displayUser.email}</span>
                  </div>
                  {displayUser.isAdmin && (
                    <div>
                      <Badge variant="destructive">Admin</Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{displayUser.stats.articles}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{displayUser.stats.followers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{displayUser.stats.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{displayUser.stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{displayUser.stats.totalLikes}</div>
                <div className="text-sm text-muted-foreground">Total Likes</div>
              </div>
            </div>
          </Card>
        </div>

        {/* Content Tabs */}
        <Tabs defaultValue="published" className="w-full">
          <TabsList className="mb-6">
            <TabsTrigger value="published" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Published Articles
            </TabsTrigger>
            <TabsTrigger value="drafts" className="flex items-center gap-2">
              <Edit className="h-4 w-4" />
              Drafts & Submissions
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              Analytics
            </TabsTrigger>
          </TabsList>
          
                    <TabsContent value="published" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold">Published Articles</h2>
              <Button variant="gradient">
              <Link to="/write">Write New Article</Link>
              </Button>
            </div>
            {publishedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {publishedArticles.map((article) => (
                  <BlogCard key={article.id} {...article} />
                ))}
              </div>
            ) : (
              <Card className="p-12 text-center bg-gradient-card shadow-soft">
                <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No published articles yet</h3>
                <p className="text-muted-foreground mb-4">
                  Start writing and sharing your knowledge with the community.
                </p>
                <Button variant="gradient" asChild>
                  <Link to="/write">Write Your First Article</Link>
                </Button>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="drafts" className="space-y-6">
            <h2 className="text-2xl font-bold">Drafts & Submissions</h2>
            <div className="space-y-4">
              {/* Pending Articles */}
              {draftArticles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Under Review</h3>
                  {draftArticles.map((article) => (
                    <Card key={article.id} className="p-6 bg-gradient-card shadow-soft mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{article.title}</h4>
                            <StatusBadge status={article.status} />
                          </div>
                          <p className="text-muted-foreground mb-3 line-clamp-2">{article.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {article.tags?.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last modified: {article.lastModified}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {/* Rejected Articles */}
              {rejectedArticles.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Rejected Articles</h3>
                  {rejectedArticles.map((article) => (
                    <Card key={article.id} className="p-6 bg-gradient-card shadow-soft mb-4">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold">{article.title}</h4>
                            <StatusBadge status={article.status} />
                          </div>
                          <p className="text-muted-foreground mb-3 line-clamp-2">{article.excerpt}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {article.tags?.map((tag: string) => (
                              <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last modified: {article.lastModified}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Edit className="h-4 w-4 mr-2" />
                            Revise & Resubmit
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
              
              {draftArticles.length === 0 && rejectedArticles.length === 0 && (
                <Card className="p-12 text-center bg-gradient-card shadow-soft">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No drafts or submissions</h3>
                  <p className="text-muted-foreground mb-4">
                    All your articles have been published. Keep writing!
                  </p>
                  <Button variant="gradient" asChild>
                    <Link to="/write">Write New Article</Link>
                  </Button>
                </Card>
              )}
            </div>
          </TabsContent>
          
          <TabsContent value="drafts" className="space-y-6">
            <h2 className="text-2xl font-bold">Drafts & Submissions</h2>
            <div className="space-y-4">
              {draftArticles.map((article) => (
                <Card key={article.id} className="p-6 bg-gradient-card shadow-soft">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{article.title}</h3>
                        <Badge variant={article.status === "Draft" ? "secondary" : "default"}>
                          {article.status}
                        </Badge>
                      </div>
                      <p className="text-muted-foreground mb-2">{article.excerpt}</p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Clock className="h-4 w-4 mr-1" />
                        Last modified {article.lastModified}
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 bg-gradient-card shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">1,247</div>
                    <div className="text-sm text-muted-foreground">This Month's Views</div>
                  </div>
                  <Eye className="h-8 w-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6 bg-gradient-card shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">89</div>
                    <div className="text-sm text-muted-foreground">This Month's Likes</div>
                  </div>
                  <Heart className="h-8 w-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6 bg-gradient-card shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">23</div>
                    <div className="text-sm text-muted-foreground">This Month's Comments</div>
                  </div>
                  <MessageCircle className="h-8 w-8 text-primary" />
                </div>
              </Card>
              <Card className="p-6 bg-gradient-card shadow-soft">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-2xl font-bold">12</div>
                    <div className="text-sm text-muted-foreground">New Followers</div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <span className="text-primary font-bold">+</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Profile;