import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-16 sm:py-20 md:py-24 px-4 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold mb-6 sm:mb-8 leading-tight">
            Share Your
            <span className="bg-gradient-text bg-clip-text text-transparent block animate-subtle-pulse drop-shadow-lg pb-2 sm:pb-3">
              Developer Story
            </span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-4">
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
              <Link to="/explore">Explore Articles</Link>
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