
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="mobile-container flex items-center justify-center p-4">
      <div className="text-center space-y-4">
        <div className="bg-outfit-primary/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
          <span className="text-4xl font-bold text-outfit-primary">404</span>
        </div>
        <h1 className="text-2xl font-bold">Page not found</h1>
        <p className="text-muted-foreground">
          We couldn't find the page you're looking for.
        </p>
        <Button asChild className="mt-4">
          <a href="/">Return to Home</a>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
