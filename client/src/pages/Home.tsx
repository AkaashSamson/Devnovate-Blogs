import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import BlogCard from "@/components/BlogCard";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, Clock, Star, ArrowRight, Sparkles } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import axios, { AxiosError } from "axios";

// TypeScript interfaces
interface BlogFromAPI {
  id: string;
  title: string;
  excerpt: string;
  author_name: string;
  published_at: string;
  tags?: string[];
  likes?: number;
  comments_count?: number;
  views?: number;
  featured_image?: string;
}

// Mock data - replace with real data from your backend
const mockBlogs = [
  {
    id: "1",
    title: "Building Scalable React Applications with TypeScript",
    excerpt: "Learn how to structure your React applications for scale using TypeScript, proper component architecture, and modern development patterns that will help your team build better software.",
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
    excerpt: "Explore the latest CSS features including Grid, Flexbox, Custom Properties, and Container Queries that will transform your web development workflow and create stunning interfaces.",
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
    excerpt: "Discover proven techniques to optimize your Node.js applications including clustering, caching, database optimization, and monitoring for production-ready performance.",
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
  },
  {
    id: "4",
    title: "The Future of Web Development: AI-Powered Tools",
    excerpt: "Explore how artificial intelligence is revolutionizing web development with automated code generation, intelligent debugging, and predictive analytics.",
    author: {
      name: "Emma Wilson",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face"
    },
    publishedAt: "5 days ago",
    readTime: "10 min read",
    tags: ["AI", "Web Development", "Future"],
    likes: 456,
    comments: 42,
    views: 2100,
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=450&fit=crop"
  },
  {
    id: "5",
    title: "Mastering State Management in React",
    excerpt: "A comprehensive guide to state management patterns in React, from useState to Redux, Zustand, and modern alternatives for scalable applications.",
    author: {
      name: "David Kim",
      avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=32&h=32&fit=crop&crop=face"
    },
    publishedAt: "1 day ago",
    readTime: "14 min read",
    tags: ["React", "State Management", "Redux"],
    likes: 298,
    comments: 35,
    views: 1800,
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop"
  },
  {
    id: "6",
    title: "Building Microservices with Docker and Kubernetes",
    excerpt: "Learn how to design, deploy, and scale microservices using Docker containers and Kubernetes orchestration for modern cloud-native applications.",
    author: {
      name: "Lisa Park",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=32&h=32&fit=crop&crop=face"
    },
    publishedAt: "4 days ago",
    readTime: "18 min read",
    tags: ["Docker", "Kubernetes", "Microservices"],
    likes: 234,
    comments: 28,
    views: 1100,
    coverImage: "https://images.unsplash.com/photo-1605745341112-85968b19335b?w=800&h=450&fit=crop"
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
          const transformedBlogs = response.data.blogs.map((blog: BlogFromAPI) => ({
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
      <Header />
      <Hero />
      
      {/* Main Content */}
      <main id="articles" className="container mx-auto px-4 py-16">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-2">
                Discover Amazing Articles
              </h2>
              <p className="text-lg text-gray-600 max-w-2xl">
                Explore the latest insights, tutorials, and stories from our community of developers
              </p>
            </div>
            
            <TabsList className="bg-white shadow-lg border border-gray-200 p-1 rounded-xl">
              <TabsTrigger 
                value="latest" 
                className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <Clock className="h-4 w-4" />
                Latest
              </TabsTrigger>
              <TabsTrigger 
                value="trending" 
                className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-red-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
                <TrendingUp className="h-4 w-4" />
                Trending
              </TabsTrigger>
              <TabsTrigger 
                value="featured" 
                className="flex items-center gap-2 px-6 py-3 rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
              >
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
        
        {/* Load More Section */}
        <div className="text-center mt-16">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-100">
            <Sparkles className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Want to see more articles?
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Discover thousands of articles from our growing community of developers and tech enthusiasts.
            </p>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-white hover:bg-gray-50 border-2 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 px-8 py-4 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <span>Load More Articles</span>
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;