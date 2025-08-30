import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { PenTool, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
      toast({
        title: "Reset link sent",
        description: "Check your email for password reset instructions.",
      });
    }, 2000);
  };

  const handleResend = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Reset link resent",
        description: "A new password reset link has been sent to your email.",
      });
    }, 2000);
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
            Reset your password
          </p>
        </div>

        <Card className="p-6 sm:p-8 bg-background/95 backdrop-blur-md shadow-strong border-0">
          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center mb-6">
                <h1 className="text-xl sm:text-2xl font-bold mb-2">
                  Forgot Password?
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <div>
                <Label htmlFor="email">Email Address</Label>
                <div className="relative mt-2">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10"
                    required
                    disabled={isLoading}
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                variant="gradient" 
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </Button>

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
                </div>
                <h1 className="text-xl sm:text-2xl font-bold mb-2">
                  Check Your Email
                </h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>

              <div className="bg-muted/50 rounded-lg p-3 sm:p-4">
                <h3 className="font-medium mb-2 text-sm sm:text-base">Didn't receive the email?</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                  Check your spam folder or try resending the reset link.
                </p>
                <Button 
                  onClick={handleResend}
                  variant="outline" 
                  className="w-full"
                  disabled={isLoading}
                >
                  {isLoading ? "Sending..." : "Resend Reset Link"}
                </Button>
              </div>

              <div className="text-center">
                <Link 
                  to="/login" 
                  className="inline-flex items-center text-sm text-primary hover:underline"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Sign In
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
