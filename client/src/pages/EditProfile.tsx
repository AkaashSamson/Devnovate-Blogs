import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Save, ArrowLeft, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAppContext } from "@/context/AppContext";
import axios from "axios";

const EditProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: ""
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { isLoggedIn, user, backendUrl, setUser } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoggedIn) {
      toast({
        title: "Authentication required",
        description: "Please log in to edit your profile.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }
  }, [isLoggedIn, navigate, toast]);

  // Fetch current user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!isLoggedIn) return;
      
      try {
        axios.defaults.withCredentials = true;
        const response = await axios.get(`${backendUrl}/users/me`);
        
        if (response.data.success) {
          const userData = response.data.user;
          setFormData({
            name: userData.name || "",
            bio: userData.bio || "",
            location: userData.location || "",
            website: userData.website || ""
          });
        }
      } catch (error: any) {
        console.error('Error fetching user data:', error);
        toast({
          title: "Error loading profile",
          description: "Failed to load profile data.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [isLoggedIn, backendUrl, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      axios.defaults.withCredentials = true;
      const response = await axios.put(`${backendUrl}/users/me`, formData);
      
      if (response.data.success) {
        // Update user context with new name if changed
        if (user && formData.name !== user.name) {
          setUser({
            ...user,
            name: formData.name
          });
        }

        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully.",
        });
        navigate("/profile");
      }
    } catch (error: any) {
      console.error('Error updating profile:', error);
      const message = error?.response?.data?.message || "Failed to update profile";
      toast({
        title: "Error updating profile",
        description: message,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Don't render if not logged in
  if (!isLoggedIn) {
    return null;
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Loading profile data...</p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/profile")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Profile
          </Button>
          <h1 className="text-4xl font-bold mb-2">Edit Profile</h1>
          <p className="text-muted-foreground">
            Update your profile information
          </p>
        </div>

        <Card className="p-8 bg-gradient-card shadow-soft">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <Label htmlFor="name" className="text-base font-semibold">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Your full name"
                className="mt-2"
                required
              />
            </div>

            {/* Bio */}
            <div>
              <Label htmlFor="bio" className="text-base font-semibold">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => handleInputChange('bio', e.target.value)}
                placeholder="Tell us about yourself..."
                className="mt-2"
                rows={4}
                maxLength={500}
              />
              <p className="text-sm text-muted-foreground mt-1">
                {formData.bio.length}/500 characters
              </p>
            </div>

            {/* Location */}
            <div>
              <Label htmlFor="location" className="text-base font-semibold">Location</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder="Your location"
                className="mt-2"
              />
            </div>

            {/* Website */}
            <div>
              <Label htmlFor="website" className="text-base font-semibold">Website</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="https://yourwebsite.com"
                className="mt-2"
                type="url"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4 pt-4">
              <Button 
                type="submit" 
                variant="gradient" 
                className="flex-1"
                disabled={saving}
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate("/profile")}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default EditProfile;
