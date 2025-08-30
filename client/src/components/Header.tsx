import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PenTool, User, LogIn, LogOut, Shield } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Header = () => {
  const { isLoggedIn, setIsLoggedIn, setUser, setIsAdmin, isAdmin, backendUrl } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      axios.defaults.withCredentials = true;
      await axios.post(`${backendUrl}/auth/logout`);
      
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      // Navigate to home page
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout fails on backend, clear frontend state
      setIsLoggedIn(false);
      setUser(null);
      setIsAdmin(false);
      
      toast({
        title: "Logged out",
        description: "You have been logged out.",
      });
      
      // Navigate to home page even if logout request failed
      navigate('/');
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b shadow-soft">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-gradient-primary p-2 rounded-lg">
            <PenTool className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">
            Devnovate    
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search articles..." 
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-4">
          <Button variant="ghost" asChild>
            <Link to="/trending">Trending</Link>
          </Button>
          <Button variant="gradient" asChild>
            <Link to="/write">Write</Link>
          </Button>
          {isAdmin && (
            <Button variant="outline" asChild>
              <Link to="/admin-dashboard">
                <Shield className="h-4 w-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          )}
          {isLoggedIn ? (
            <Button variant="ghost" size="icon" asChild>
              <Link to="/profile">
                <User className="h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <Button variant="ghost" size="icon" disabled>
              <User className="h-4 w-4" />
            </Button>
          )}
          {isLoggedIn ? (
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Button variant="outline" asChild>
              <Link to="/login">
                <LogIn className="h-4 w-4 mr-2" />
                Login
              </Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;