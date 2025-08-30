import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 overflow-hidden">
      {/* Base Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20"></div>
      
      {/* Eye-catching Minimalistic Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-35"
        style={{
          backgroundImage: `url('data:image/svg+xml,%3Csvg width="400" height="400" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg"%3E%3Cdefs%3E%3ClinearGradient id="waveGrad" x1="0%25" y1="0%25" x2="100%25" y2="100%25"%3E%3Cstop offset="0%25" style="stop-color:%233b82f6;stop-opacity:0.06" /%3E%3Cstop offset="50%25" style="stop-color:%238b5cf6;stop-opacity:0.04" /%3E%3Cstop offset="100%25" style="stop-color:%23ec4899;stop-opacity:0.02" /%3E%3C/linearGradient%3E%3CradialGradient id="particleGrad" cx="50%25" cy="50%25" r="50%25"%3E%3Cstop offset="0%25" style="stop-color:%233b82f6;stop-opacity:0.1" /%3E%3Cstop offset="100%25" style="stop-color:%233b82f6;stop-opacity:0" /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width="100%25" height="100%25" fill="url(%23waveGrad)"/%3E%3C!-- Gradient waves --%3E%3Cpath d="M 0 200 Q 100 150 200 200 T 400 200" stroke="%233b82f6" stroke-width="2" fill="none" opacity="0.08" stroke-linecap="round"/%3E%3Cpath d="M 0 250 Q 100 200 200 250 T 400 250" stroke="%238b5cf6" stroke-width="1.5" fill="none" opacity="0.06" stroke-linecap="round"/%3E%3Cpath d="M 0 150 Q 100 100 200 150 T 400 150" stroke="%23ec4899" stroke-width="1" fill="none" opacity="0.05" stroke-linecap="round"/%3E%3C!-- Floating particles --%3E%3Ccircle cx="80" cy="80" r="4" fill="url(%23particleGrad)" opacity="0.3"/%3E%3Ccircle cx="320" cy="120" r="3" fill="url(%23particleGrad)" opacity="0.25"/%3E%3Ccircle cx="120" cy="320" r="3" fill="url(%23particleGrad)" opacity="0.2"/%3E%3Ccircle cx="280" cy="280" r="2" fill="url(%23particleGrad)" opacity="0.15"/%3E%3C!-- Geometric accents --%3E%3Cpolygon points="200,50 220,80 200,110 180,80" fill="none" stroke="%233b82f6" stroke-width="1" opacity="0.1"/%3E%3Cpolygon points="300,300 320,330 300,360 280,330" fill="none" stroke="%238b5cf6" stroke-width="1" opacity="0.08"/%3E%3C!-- Minimal connecting lines --%3E%3Cline x1="100" y1="100" x2="300" y2="300" stroke="%233b82f6" stroke-width="0.5" opacity="0.04" stroke-dasharray="3,6"/%3E%3Cline x1="300" y1="100" x2="100" y2="300" stroke="%238b5cf6" stroke-width="0.5" opacity="0.04" stroke-dasharray="3,6"/%3E%3C!-- Subtle dots --%3E%3Ccircle cx="50" cy="50" r="1" fill="%233b82f6" opacity="0.2"/%3E%3Ccircle cx="350" cy="350" r="1" fill="%238b5cf6" opacity="0.2"/%3E%3Ccircle cx="50" cy="350" r="1" fill="%23ec4899" opacity="0.2"/%3E%3Ccircle cx="350" cy="50" r="1" fill="%233b82f6" opacity="0.2"/%3E%3C/svg%3E')`
        }}
      ></div>
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      
      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-16 h-16 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full opacity-30 animate-pulse"></div>
      <div className="absolute top-40 right-20 w-12 h-12 bg-gradient-to-br from-purple-400/20 to-pink-400/20 rounded-full opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute bottom-20 left-1/4 w-8 h-8 bg-gradient-to-br from-pink-400/20 to-red-400/20 rounded-full opacity-30 animate-pulse delay-2000"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 leading-loose">
            <span className="block text-gray-900 mb-1">Share Your</span>
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent animate-gradient pb-2">
              Developer Story
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
            Join thousands of developers sharing knowledge, insights, and experiences. 
            Write, publish, and grow with the Devnovate community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-12 sm:mb-16 px-4">
            <Button variant="hero" size="lg" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/write">
                Start Writing
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/collections">My Collections</Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 sm:gap-6 md:gap-8 max-w-md mx-auto px-4">
            <div className="text-center p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-2 sm:mb-3">
                <Users className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold">10K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Writers</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-2 sm:mb-3">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">25K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center p-3 sm:p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-2 sm:mb-3">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 text-primary" />
              </div>
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-foreground">100K+</div>
              <div className="text-xs sm:text-sm text-muted-foreground">Readers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;