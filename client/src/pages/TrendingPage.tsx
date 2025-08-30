import React from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Eye, TrendingUp } from "lucide-react";
//mport { ImageWithFallback } from "@/components/figma/ImageWithFallback";

// Mock data for demo (replace later with real backend data)
const mockTrendingBlogs = [
  {
    id: "1",
    title: "Optimizing React for High-Performance Applications",
    excerpt:
      "Learn practical strategies to make your React apps blazing fast with memoization, code splitting, and more.",
    author_name: "Alice Green",
    tags: ["React", "Performance", "Frontend"],
    featured_image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop",
    views: 2200,
    likes: 350,
    comments_count: 42,
    published_at: "2025-08-20",
  },
  {
    id: "2",
    title: "Exploring the Future of TypeScript in 2025",
    excerpt:
      "Dive into the latest features and community trends that are shaping the TypeScript ecosystem.",
    author_name: "David Kim",
    tags: ["TypeScript", "Web Dev"],
    featured_image:
      "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=800&h=450&fit=crop",
    views: 1800,
    likes: 290,
    comments_count: 33,
    published_at: "2025-08-18",
  },
  {
    id: "3",
    title: "10 Tailwind CSS Tricks Every Developer Should Know",
    excerpt:
      "Discover hidden gems and advanced tips in Tailwind CSS to speed up your workflow.",
    author_name: "Maria Lopez",
    tags: ["Tailwind", "CSS", "Design"],
    featured_image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=450&fit=crop",
    views: 1500,
    likes: 210,
    comments_count: 21,
    published_at: "2025-08-15",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getTrendingScore = (blog: any) => {
  return blog.likes + blog.comments_count + Math.floor(blog.views / 10);
};

const TrendingPage: React.FC = () => {
  const blogs = mockTrendingBlogs;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">Trending Blogs</h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Discover the most popular and engaging content from our community
        </p>
      </div>

      <div className="space-y-8">
        {/* Featured Trending Blog */}
        {blogs[0] && (
          <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
            <div className="md:flex">
              {/* {blogs[0].featured_image && (
                <div className="md:w-1/2 h-64 md:h-auto">
                  <ImageWithFallback
                    src={blogs[0].featured_image}
                    alt={blogs[0].title}
                    className="w-full h-full object-cover"
                  />

                </div>
              )} */}

              <div
                className={`${
                  blogs[0].featured_image ? "md:w-1/2" : "w-full"
                } p-6`}
              >
                <div className="flex items-center mb-4">
                  <Badge className="bg-orange-100 text-orange-800 border-orange-200">
                    #1 Trending
                  </Badge>
                  <div className="ml-3 flex items-center text-sm text-orange-600">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    {getTrendingScore(blogs[0])} points
                  </div>
                </div>

                <h2 className="text-2xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors cursor-pointer">
                  {blogs[0].title}
                </h2>

                <p className="text-gray-600 mb-4 line-clamp-3">
                  {blogs[0].excerpt}
                </p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {blogs[0].tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    By {blogs[0].author_name} •{" "}
                    {formatDate(blogs[0].published_at)}
                  </div>

                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Heart className="w-4 h-4" />
                      <span>{blogs[0].likes}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="w-4 h-4" />
                      <span>{blogs[0].comments_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Eye className="w-4 h-4" />
                      <span>{blogs[0].views}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Other Trending Blogs */}
        {blogs.length > 1 && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.slice(1).map((blog, index) => (
              <Card
                key={blog.id}
                className="hover:shadow-lg transition-shadow cursor-pointer group"
              >
                <div className="relative">
                  {/* {blog.featured_image && (
                    <div className="h-48 overflow-hidden rounded-t-lg">
                      <ImageWithFallback
                        src={blog.featured_image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )} */}

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
                      {getTrendingScore(blog)}
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
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
      </div>
    </div>
    </div>

  );
};

export default TrendingPage;
