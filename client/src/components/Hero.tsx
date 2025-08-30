import { Button } from "@/components/ui/button";
import { ArrowRight, Users, BookOpen, TrendingUp } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <section className="relative py-20 px-4 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-hero opacity-5"></div>
      
      <div className="container mx-auto text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-snug text-gray-900">
              Share Your <br />
            <span className="bg-gradient-to-r from-purple-500 to-pink-500 bg-clip-text text-transparent">
              Developer Story
            </span>
          </h1>

          
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of developers sharing knowledge, insights, and experiences. 
            Write, publish, and grow with the Devnovate community.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button variant="hero" size="lg" asChild>
              <Link to="/write">
                Start Writing
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" onClick={() => {
              document.getElementById("articles")?.scrollIntoView({ behavior: "smooth" });
              }}>
             Explore Articles
            </Button>
          </div>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">10K+</div>
              <div className="text-sm text-muted-foreground">Writers</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">25K+</div>
              <div className="text-sm text-muted-foreground">Articles</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                <TrendingUp className="h-6 w-6 text-primary" />
              </div>
              <div className="text-2xl font-bold">100K+</div>
              <div className="text-sm text-muted-foreground">Readers</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;