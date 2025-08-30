import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PenTool, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { AxiosError } from "axios";
import { useAppContext } from "@/context/AppContext";
import { loginUser, registerUser } from "@/services/authService";

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: ""
  });
  const { toast } = useToast();
  const { setUser, setIsLoggedIn, setIsAdmin, setLoading, loading } = useAppContext();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      let response;
      if (isLogin) {
        response = await loginUser({ 
          email: formData.email, 
          password: formData.password 
        });
      } else {
        response = await registerUser({ 
          name: formData.name, 
          email: formData.email, 
          password: formData.password 
        });
      }

      if (response.success && response.user) {
        setUser({ 
          id: response.user.id, 
          name: response.user.name, 
          email: response.user.email, 
          isAdmin: response.user.isAdmin 
        });
        setIsLoggedIn(true);
        setIsAdmin(response.user.isAdmin || false);
        
        // Redirect based on admin status
        if (response.user.isAdmin) {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      }

      toast({
        title: isLogin ? "Login successful" : "Account created",
        description: isLogin
          ? `Welcome back${response?.user?.name ? ", " + response.user.name : ""}!`
          : "You can now verify (if needed) and start writing.",
      });
      // Optionally navigate after login (not implemented yet)
    } catch (err: any) {
      let msg = "Action failed";
      if (err.message) {
        msg = err.message;
      }
      toast({
        title: "Error",
        description: msg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-sm sm:max-w-md">
        {/* Logo */}
        <div className="text-center mb-6 sm:mb-8">
          <Link to="/" className="inline-flex items-center space-x-2">
            <div className="bg-background/20 p-2 sm:p-3 rounded-xl backdrop-blur-sm">
              <PenTool className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <span className="text-2xl sm:text-3xl font-bold text-white">
              Devnovate
            </span>
          </Link>
          <p className="text-white/80 mt-2 text-sm sm:text-base">
            {isLogin ? "Welcome back!" : "Join the community"}
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-background/95 backdrop-blur-md shadow-strong border-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="text-center mb-6">
              <h1 className="text-xl sm:text-2xl font-bold mb-2">
                {isLogin ? "Sign In" : "Create Account"}
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                {isLogin 
                  ? "Enter your credentials to access your account" 
                  : "Start your journey as a developer writer"
                }
              </p>
            </div>

            {!isLogin && (
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="mt-2"
                  required
                />
              </div>
            )}

            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative mt-2">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="pl-10"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <div className="relative mt-2">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  className="pl-10 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot password?
                </Link>
              </div>
            )}

            <Button type="submit" variant="gradient" className="w-full" disabled={loading}>
              {loading ? (isLogin ? "Signing In..." : "Creating Account...") : (isLogin ? "Sign In" : "Create Account")}
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute inset-x-0 -top-3 flex justify-center">
                <span className="bg-background px-4 text-sm text-muted-foreground">or</span>
              </span>
            </div>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="ml-2 text-primary font-medium hover:underline"
                >
                  {isLogin ? "Sign up" : "Sign in"}
                </button>
              </p>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default Login;