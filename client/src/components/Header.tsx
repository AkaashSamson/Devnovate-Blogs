import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, PenTool, User, LogIn, LogOut, Shield, Home, TrendingUp, PencilLine, Menu } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useState } from "react";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-white/80 border-b border-gray-200/50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 cursor-pointer group">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                <PenTool className="w-6 h-6 text-white" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Devnovate
              </span>
              <div className="text-xs text-gray-500 -mt-1">Blogs</div>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-200 group relative"
            >
              <Home className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Home</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              to="/trending"
              className="flex items-center text-gray-700 hover:text-orange-600 transition-all duration-200 group relative"
            >
              <TrendingUp className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Trending</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-orange-600 to-red-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            <Link
              to="/write"
              className="flex items-center text-gray-700 hover:text-green-600 transition-all duration-200 group relative"
            >
              <PencilLine className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
              <span className="font-medium">Write</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-green-600 to-emerald-600 group-hover:w-full transition-all duration-300"></div>
            </Link>
            {isLoggedIn && (
              <Link
                to="/profile"
                className="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-200 group relative"
              >
                <User className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform duration-200" />
                <span className="font-medium">Profile</span>
                <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-purple-600 to-pink-600 group-hover:w-full transition-all duration-300"></div>
              </Link>
            )}
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Button variant="outline" asChild className="hidden sm:flex">
                <Link to="/admin-dashboard">
                  <Shield className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            )}
            {isLoggedIn ? (
              <>
                <Button 
                  variant="ghost" 
                  asChild
                  className="hidden sm:flex hover:bg-gray-100 transition-all duration-200"
                >
                  <Link to="/profile">
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleLogout}
                  className="hover:bg-red-50 hover:text-red-600 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <Button 
                variant="default" 
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
              >
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  Login
                </Link>
              </Button>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="flex flex-col space-y-3">
              <Link
                to="/"
                className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <Home className="w-4 h-4 mr-3" />
                <span>Home</span>
              </Link>
              <Link
                to="/trending"
                className="flex items-center text-gray-700 hover:text-orange-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <TrendingUp className="w-4 h-4 mr-3" />
                <span>Trending</span>
              </Link>
              <Link
                to="/write"
                className="flex items-center text-gray-700 hover:text-green-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                <PencilLine className="w-4 h-4 mr-3" />
                <span>Write</span>
              </Link>
              {isAdmin && (
                <Link
                  to="/admin-dashboard"
                  className="flex items-center text-gray-700 hover:text-purple-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <Shield className="w-4 h-4 mr-3" />
                  <span>Dashboard</span>
                </Link>
              )}
              {isLoggedIn ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                  >
                    <User className="w-4 h-4 mr-3" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center text-gray-700 hover:text-red-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50 text-left"
                  >
                    <LogOut className="w-4 h-4 mr-3" />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center text-gray-700 hover:text-blue-600 transition-all duration-200 px-3 py-2 rounded-lg hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4 mr-3" />
                  <span>Login</span>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Header;