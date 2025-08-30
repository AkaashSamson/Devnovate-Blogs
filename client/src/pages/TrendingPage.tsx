import React, { useState } from "react";
import Header from "@/components/Header";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Heart, MessageCircle, Eye, TrendingUp, Search } from "lucide-react";

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
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    views: 1500,
    likes: 210,
    comments_count: 21,
    published_at: "2025-08-15",
  },
  {
    id: "4",
    title: "Mastering Git: Pro Tips for Developers",
    excerpt:
      "Learn advanced Git commands, workflows, and tricks to boost your productivity and collaboration.",
    author_name: "James Parker",
    tags: ["Git", "Version Control", "Collaboration"],
    featured_image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    views: 2300,
    likes: 340,
    comments_count: 45,
    published_at: "2025-08-20",
  },
  {
    id: "5",
    title: "React Performance Optimization Guide",
    excerpt:
      "From code splitting to memoization, explore techniques to make your React apps lightning fast.",
    author_name: "Sophia Kim",
    tags: ["React", "Performance", "JavaScript"],
    featured_image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&h=450&fit=crop",
    views: 3100,
    likes: 520,
    comments_count: 67,
    published_at: "2025-08-22",
  },
  {
    id: "6",
    title: "Demystifying AI: What Every Developer Should Know",
    excerpt:
      "Artificial Intelligence is everywhere—understand the basics and its real-world applications.",
    author_name: "Rahul Sharma",
    tags: ["AI", "Machine Learning", "Future"],
    featured_image:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop",
    views: 4200,
    likes: 610,
    comments_count: 83,
    published_at: "2025-08-24",
  },
  {
    id: "7",
    title: "Building Scalable Apps with Firebase",
    excerpt:
      "Firebase offers authentication, database, hosting, and more—see how it can supercharge your app.",
    author_name: "Emily Zhang",
    tags: ["Firebase", "Cloud", "App Development"],
    featured_image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=450&fit=crop",
    views: 1900,
    likes: 280,
    comments_count: 34,
    published_at: "2025-08-26",
  },
  {
    id: "8",
    title: "The Rise of TypeScript in Modern Development",
    excerpt:
      "Why developers are switching to TypeScript and how it improves code safety and maintainability.",
    author_name: "Oliver Johnson",
    tags: ["TypeScript", "JavaScript", "Best Practices"],
    featured_image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop",
    views: 2700,
    likes: 390,
    comments_count: 56,
    published_at: "2025-08-28",
  }

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
  const [searchQuery, setSearchQuery] = useState("");

  // Filter blogs by title, author, or tags
  const blogs = mockTrendingBlogs.filter((blog) => {
    const query = searchQuery.toLowerCase();
    return (
      blog.title.toLowerCase().includes(query) ||
      blog.author_name.toLowerCase().includes(query) ||
      blog.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <TrendingUp className="w-8 h-8 text-orange-500 mr-3" />
            <h1 className="text-3xl font-bold text-gray-900">
              Trending Blogs
            </h1>
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
          {blogs.length === 0 ? (
            <p className="text-center text-gray-600">
              No blogs match your search.
            </p>
          ) : (
            <>
              {/* Featured Blog */}
              {blogs[0] && (
                <Card className="overflow-hidden hover:shadow-xl transition-shadow cursor-pointer">
  <div className="md:flex">
    {/* Image Section */}
    {blogs[0].featured_image && (
      <div className="md:w-1/2">
        <img
          src={blogs[0].featured_image}
          alt={blogs[0].title}
          className="h-full w-full object-cover"
        />
      </div>
    )}

    {/* Content Section */}
    <div className={`${blogs[0].featured_image ? "md:w-1/2" : "w-full"} p-6`}>
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

      <p className="text-gray-600 mb-4 line-clamp-3">{blogs[0].excerpt}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {blogs[0].tags.slice(0, 3).map((tag) => (
          <Badge key={tag} variant="secondary" className="text-xs">
            {tag}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-500">
          By {blogs[0].author_name} • {formatDate(blogs[0].published_at)}
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

              {/* Other Blogs */}
              {blogs.length > 1 && (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {blogs.slice(1).map((blog, index) => (
                    <Card key={blog.id} className="hover:shadow-lg transition-shadow cursor-pointer group">
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
        {getTrendingScore(blog)}
      </div>
    </div>
    <h3 className="text-lg font-semibold group-hover:text-blue-600 transition-colors line-clamp-2">
      {blog.title}
    </h3>
    <p className="text-gray-600 text-sm line-clamp-3">{blog.excerpt}</p>
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
