
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { MapPin, BookOpen, Home } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  const isActiveRoute = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white/80 backdrop-blur-sm border-b border-nature-green-dark/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <MapPin className="h-6 w-6 text-nature-green-dark" />
              <span className="ml-2 text-xl font-semibold text-nature-green-dark">Parks of Mill Creek</span>
            </Link>
          </div>
          <div className="flex space-x-2">
            <Link 
              to="/" 
              className={cn("nav-link flex items-center", 
                isActiveRoute("/") && "nav-link-active")}>
              <Home className="h-4 w-4 mr-1.5" />
              Home
            </Link>
            <Link 
              to="/map" 
              className={cn("nav-link flex items-center", 
                isActiveRoute("/map") && "nav-link-active")}>
              <MapPin className="h-4 w-4 mr-1.5" />
              Map
            </Link>
            <Link 
              to="/learn" 
              className={cn("nav-link flex items-center", 
                isActiveRoute("/learn") && "nav-link-active")}>
              <BookOpen className="h-4 w-4 mr-1.5" />
              Learn
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
