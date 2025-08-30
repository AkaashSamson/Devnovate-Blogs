import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PenTool, User, LogIn, Home, Flame, PencilLine } from "lucide-react";

const Header = () => {
  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 cursor-pointer">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <PenTool className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Devnovate</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-20">
            <Link
              to="/"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Home className="w-4 h-4 mr-1" />
              Home
            </Link>
            <Link
              to="/trending"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <Flame className="w-4 h-4 mr-1" />
              Trending
            </Link>
            <Link
              to="/write"
              className="flex items-center text-gray-700 hover:text-blue-600 transition-colors"
            >
              <PencilLine className="w-4 h-4 mr-1" />
              Write
            </Link>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            <Button variant="ghost" asChild>
              <Link to="/profile">
                <User className="w-4 h-4 mr-2" />
                Profile
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/login">
                <LogIn className="w-4 h-4 mr-2" />
                Login
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Header;
