import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Eye, TrendingUp, Search } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import apiClient from "@/services/apiClient";

// Blog interface
interface Blog {
  id: string;
  title: string;
  excerpt: string;
  author_name: string;
  tags: string[];
  featured_image: string;
  views: number;
  likes: number;
  comments_count: number;
  trending_points: number;
  published_at: string;
}

// Format date
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const TrendingPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Fetch trending blogs from backend
  useEffect(() => {
    const fetchTrendingBlogs = async () => {
      try {
        const response = await apiClient.get('/blogs/trending');
        
        if (response.data.success) {
          // Add default featured image if missing
          const blogsWithImages = response.data.blogs.map((blog: Blog) => ({
            ...blog,
            featured_image: blog.featured_image || "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop"
          }));
          setBlogs(blogsWithImages);
        } else {
          throw new Error('Failed to fetch trending blogs');
        }
      } catch (error) {
        console.error('Error fetching trending blogs:', error);
        toast({
          title: "Error",
          description: "Failed to load trending blogs.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingBlogs();
  }, [toast]);

  // Handle blog click
  const handleBlogClick = (blogId: string) => {
    navigate(`/blog/${blogId}`);
  };

  // Filter blogs by title, author, or tags
  const filteredBlogs = blogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.author_name.toLowerCase().includes(query) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  // Blogs are already sorted by trending_points from the backend
  const sortedBlogs = filteredBlogs;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Trending Blogs</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover the most popular and engaging content from our community
          </p>
        </div>

        {/* 🔍 Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <Input
            type="text"
            placeholder="Search blogs by title, author, or tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border rounded-lg"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
        </div>

        {/* Blog Section */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-muted-foreground">Loading trending blogs...</p>
              </div>
            </div>
          ) : sortedBlogs.length === 0 ? (
            <p className="text-center text-gray-600">No blogs match your search.</p>
          ) : (
            <>
              {/* Featured Blog */}
              {sortedBlogs[0] && (
                <Card 
                  className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer"
                  onClick={() => handleBlogClick(sortedBlogs[0].id)}
                >
                  <div className="md:flex">
                    {/* Image Section */}
                    <div className="md:w-1/2">
                      {sortedBlogs[0].featured_image && (
                        <img
                          src={sortedBlogs[0].featured_image}
                          alt={sortedBlogs[0].title}
                          className="h-full w-full object-cover"
                        />
                      )}
                    </div>

                    {/* Content Section */}
                    <div
                      className={`${
                        sortedBlogs[0].featured_image ? "md:w-1/2" : "w-full"
                      } p-6`}
                    >
                      <div className="flex items-center mb-4">
                        <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                          #1 Trending
                        </Badge>
                        <div className="ml-3 flex items-center text-sm text-orange-600">
                          <TrendingUp className="w-4 h-4 mr-1" />
                          {sortedBlogs[0].trending_points} points
                        </div>
                      </div>

                      <h2 
                        className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer"
                        onClick={() => handleBlogClick(sortedBlogs[0].id)}
                      >
                        {sortedBlogs[0].title}
                      </h2>

                      <p className="text-gray-600 mb-4 line-clamp-3">
                        {sortedBlogs[0].excerpt}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {sortedBlogs[0].tags.slice(0, 3).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="text-sm text-gray-500">
                          By {sortedBlogs[0].author_name} •{" "}
                          {formatDate(sortedBlogs[0].published_at)}
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Heart className="w-4 h-4" />
                            <span>{sortedBlogs[0].likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageCircle className="w-4 h-4" />
                            <span>{sortedBlogs[0].comments_count}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{sortedBlogs[0].views}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              )}

              {/* Other Blogs */}
              {sortedBlogs.length > 1 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {sortedBlogs.slice(1).map((blog, index) => (
                    <Card
                      key={blog.id}
                      className="hover:shadow-lg transition-shadow cursor-pointer group"
                      onClick={() => handleBlogClick(blog.id)}
                    >
                      <div className="relative">
                        {/* Blog Image */}
                        <img
                          src={blog.featured_image}
                          alt={blog.title}
                          className="w-full h-40 object-cover rounded-t-2xl"
                        />

                        {/* Ranking Badge */}
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                            #{index + 2}
                          </Badge>
                        </div>
                      </div>

                      <CardHeader>
                        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                          <span>By {blog.author_name}</span>
                          <div className="flex items-center text-orange-600">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {blog.trending_points}
                          </div>
                        </div>
                        <h3 
                          className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2"
                          onClick={() => handleBlogClick(blog.id)}
                        >
                          {blog.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-3">
                          {blog.excerpt}
                        </p>
                      </CardHeader>

                      <CardContent>
                        {blog.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {blog.tags.slice(0, 2).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{blog.likes}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <MessageCircle className="w-4 h-4" />
                              <span>{blog.comments_count}</span>
                            </div>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Eye className="w-4 h-4" />
                            <span>{blog.views}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrendingPage;
