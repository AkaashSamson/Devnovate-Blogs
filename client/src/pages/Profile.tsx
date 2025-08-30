import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Edit, Eye, Clock, Heart, MessageCircle } from "lucide-react";
import BlogCard from "@/components/BlogCard";

const Profile = () => {
  const user = {
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=128&h=128&fit=crop&crop=face",
    bio: "Full-stack developer passionate about React and TypeScript. Building scalable web applications for 5+ years.",
    joinedDate: "January 2023",
    location: "San Francisco, CA",
    website: "alexjohnson.dev",
    stats: {
      articles: 12,
      followers: 1420,
      following: 89,
      totalViews: 15600,
      totalLikes: 892
    }
  };

  const publishedArticles = [
    {
      id: "1",
      title: "Building Scalable React Applications with TypeScript",
      excerpt: "Learn how to structure your React applications for scale using TypeScript, proper component architecture, and modern development patterns.",
      author: user,
      publishedAt: "2 days ago",
      readTime: "8 min read",
      tags: ["React", "TypeScript", "Architecture"],
      likes: 245,
      comments: 18,
      views: 1200,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
    }
  ];

  const draftArticles = [
    {
      id: "draft-1",
      title: "Advanced React Patterns You Should Know",
      excerpt: "Exploring render props, compound components, and other advanced React patterns for better code organization.",
      status: "Draft",
      lastModified: "1 day ago"
    },
    {
      id: "draft-2", 
      title: "Understanding TypeScript Generics",
      excerpt: "A deep dive into TypeScript generics with practical examples and use cases.",
      status: "Under Review",
      lastModified: "3 days ago"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="mb-8">
          <Card className="p-8 bg-gradient-card shadow-medium">
            <div className="flex flex-col md:flex-row items-start md:items-center space-y-6 md:space-y-0 md:space-x-8">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="text-2xl">
                  {user.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-3xl font-bold">{user.name}</h1>
                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                    <Button variant="ghost" size="sm">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-4 max-w-2xl">{user.bio}</p>
                
                <div className="flex flex-wrap gap-6 text-sm">
                  <div>
                    <span className="text-muted-foreground">Joined:</span>
                    <span className="ml-2 font-medium">{user.joinedDate}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Location:</span>
                    <span className="ml-2 font-medium">{user.location}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Website:</span>
                    <span className="ml-2 font-medium text-primary">{user.website}</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-8 pt-6 border-t">
              <div className="text-center">
                <div className="text-2xl font-bold">{user.stats.articles}</div>
                <div className="text-sm text-muted-foreground">Articles</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.stats.followers.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Followers</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.stats.following}</div>
                <div className="text-sm text-muted-foreground">Following</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.stats.totalViews.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Total Views</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">{user.stats.totalLikes}</div>
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
                Write New Article
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publishedArticles.map((article) => (
                <BlogCard key={article.id} {...article} />
              ))}
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