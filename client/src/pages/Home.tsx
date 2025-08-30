import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, Star } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

// Mock data - replace with real data from your backend
const mockBlogs = [
  {
    id: "1",
    title: "Building Scalable React Applications with TypeScript",
    excerpt: "Learn how to structure your React applications for scale using TypeScript, proper component architecture, and modern development patterns.",
    author: {
      name: "Alex Johnson",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
    },
    publishedAt: "2 days ago",
    readTime: "8 min read",
    tags: ["React", "TypeScript", "Architecture"],
    likes: 245,
    comments: 18,
    views: 1200,
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
  },
  {
    id: "2", 
    title: "Modern CSS Techniques Every Developer Should Know",
    excerpt: "Explore the latest CSS features including Grid, Flexbox, Custom Properties, and Container Queries that will transform your web development workflow.",
    author: {
      name: "Sarah Chen",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face"
    },
    publishedAt: "1 week ago",
    readTime: "12 min read", 
    tags: ["CSS", "Frontend", "Web Design"],
    likes: 189,
    comments: 24,
    views: 890,
    coverImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop"
  },
  {
    id: "3",
    title: "Node.js Performance Optimization Strategies",
    excerpt: "Discover proven techniques to optimize your Node.js applications including clustering, caching, database optimization, and monitoring.",
    author: {
      name: "Mike Rodriguez", 
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face"
    },
    publishedAt: "3 days ago",
    readTime: "15 min read",
    tags: ["Node.js", "Performance", "Backend"],
    likes: 312,
    comments: 31,
    views: 1500,
    coverImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=450&fit=crop"
  }
];

const Home = () => {
  const [activeTab, setActiveTab] = useState("latest");
  const [realBlogs, setRealBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { backendUrl } = useAppContext();

  // Fetch approved blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/blogs`);
        
        if (response.data.success) {
          // Transform API data to match frontend format
          const transformedBlogs = response.data.blogs.map((blog: any) => ({
            id: blog.id,
            title: blog.title,
            excerpt: blog.excerpt,
            author: {
              name: blog.author_name,
              avatar: `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face` // Default avatar
            },
            publishedAt: new Date(blog.published_at).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric' 
            }),
            readTime: `${Math.ceil(blog.excerpt.length / 200)} min read`, // Estimate read time
            tags: blog.tags || [],
            likes: blog.likes || 0,
            comments: blog.comments_count || 0,
            views: blog.views || 0,
            coverImage: blog.featured_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
          }));
          setRealBlogs(transformedBlogs);
        }
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [backendUrl]);

  // Combine dummy data with real blogs
  const allBlogs = [...mockBlogs, ...realBlogs];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <Hero />
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Discover Articles</h2>
            <TabsList className="bg-muted">
              <TabsTrigger value="latest" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger value="trending" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center gap-2">
                <Star className="h-4 w-4" />
                Featured
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value="latest" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBlogs.map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="trending" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBlogs.sort((a, b) => b.likes - a.likes).map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="featured" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {allBlogs.filter(blog => blog.likes > 200).map((blog) => (
                <BlogCard key={blog.id} {...blog} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Load More */}
        <div className="text-center mt-12">
          <Button variant="outline" size="lg">
            Load More Articles
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Home;