import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Shield, Camera, MapPin } from "lucide-react";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="bg-card/50 backdrop-blur-xl border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-gradient-primary rounded-lg shadow-glow">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-foreground">BillboardGuard</h1>
              <p className="text-xs text-muted-foreground">Smart Detection Platform</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a 
              href="#dashboard" 
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Dashboard
            </a>
            <a 
              href="#report" 
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Report
            </a>
            <a 
              href="#map" 
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                alert('Map view coming soon! This will show a real-time map of all reported billboards.');
              }}
            >
              Map View
            </a>
            <a 
              href="#analytics" 
              className="text-foreground hover:text-primary transition-colors cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              Analytics
            </a>
          </nav>

          {/* Action Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Camera className="h-4 w-4 mr-2" />
              Quick Report
            </Button>
            <Button 
              variant="default" 
              size="sm"
              onClick={() => {
                alert('Interactive map coming soon! This will show real-time billboard locations and reports.');
              }}
            >
              <MapPin className="h-4 w-4 mr-2" />
              View Map
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-foreground"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-border">
            <div className="flex flex-col space-y-3">
              <a 
                href="#dashboard" 
                className="text-foreground hover:text-primary transition-colors py-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Dashboard
              </a>
              <a 
                href="#report" 
                className="text-foreground hover:text-primary transition-colors py-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Report Billboard
              </a>
              <a 
                href="#map" 
                className="text-foreground hover:text-primary transition-colors py-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  alert('Map view coming soon!');
                  setIsMenuOpen(false);
                }}
              >
                Map View
              </a>
              <a 
                href="#analytics" 
                className="text-foreground hover:text-primary transition-colors py-2 cursor-pointer"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('dashboard')?.scrollIntoView({ behavior: 'smooth' });
                  setIsMenuOpen(false);
                }}
              >
                Analytics
              </a>
              <div className="flex flex-col space-y-2 pt-3">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
                    setIsMenuOpen(false);
                  }}
                >
                  <Camera className="h-4 w-4 mr-2" />
                  Quick Report
                </Button>
                <Button 
                  variant="default" 
                  size="sm"
                  onClick={() => {
                    alert('Interactive map coming soon!');
                    setIsMenuOpen(false);
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  View Map
                </Button>
              </div>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Header;
