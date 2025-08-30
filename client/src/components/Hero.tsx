import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-24 px-4 overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      <div className="absolute inset-0 bg-gradient-hero opacity-10"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
            Share Your
            <span className="bg-gradient-text bg-clip-text text-transparent block animate-subtle-pulse drop-shadow-lg pb-3">
              Developer Story
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers sharing knowledge, insights, and experiences. 
            Write, publish, and grow with the Devnovate community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button variant="hero" size="lg" asChild className="shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <Link to="/write">
                Start Writing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild className="shadow-md hover:shadow-lg transition-all duration-300 transform hover:scale-105">
              <Link to="/explore">Explore Articles</Link>
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-3">
                <Users className="h-7 w-7 text-primary" />
              </div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Writers</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-3">
                <BookOpen className="h-7 w-7 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">25K+</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center p-4 rounded-lg bg-card/50 backdrop-blur-sm border border-border/50 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex justify-center mb-3">
                <TrendingUp className="h-7 w-7 text-primary" />
              </div>
              <div className="text-2xl font-bold text-foreground">100K+</div>
              <div className="text-sm text-muted-foreground">Readers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;