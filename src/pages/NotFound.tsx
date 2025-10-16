import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center px-4 animate-fade-in">
        <h1 className="mb-4 text-8xl font-bold text-primary">404</h1>
        <p className="mb-4 text-2xl font-semibold text-foreground">Oops! Page not found</p>
        <p className="mb-8 text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Button asChild className="bg-gold hover:bg-gold/90 text-gold-foreground font-bold" variant="gold">
          <a href="/">
            <Home className="mr-2 h-4 w-4" />
            Return to Home
          </a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
