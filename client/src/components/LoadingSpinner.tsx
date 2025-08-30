import { PenTool } from "lucide-react";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center">
      <div className="text-center">
        <div className="bg-background/20 p-4 rounded-xl backdrop-blur-sm mb-4 mx-auto w-fit">
          <PenTool className="h-12 w-12 text-white animate-pulse" />
        </div>
        <h1 className="text-2xl font-bold text-white mb-2">Devnovate</h1>
        <p className="text-white/80">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;
