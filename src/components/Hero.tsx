import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, MapPin, Shield, Users, AlertTriangle, CheckCircle } from "lucide-react";

const Hero = () => {
  return (
    <section className="min-h-screen bg-gradient-dark relative overflow-hidden">
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      ></div>
      
      <div className="container mx-auto px-4 py-20 relative">
        {/* Main Hero Content */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-accent backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-primary/20">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm text-foreground">AI-Powered Detection Platform</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
            Flag Unauthorized
            <span className="block bg-gradient-primary bg-clip-text text-transparent">
              Billboards Instantly
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
            Empower citizens and authorities with smart detection technology to identify 
            unauthorized billboards through AI-powered image analysis and real-time reporting.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
            <Button 
              size="lg" 
              className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
              onClick={() => {
                document.getElementById('report')?.scrollIntoView({ behavior: 'smooth' });
              }}
            >
              <Camera className="h-5 w-5 mr-2" />
              Start Detection
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => {
                alert('Interactive reports map coming soon! This will show all billboard reports on a live map.');
              }}
            >
              <MapPin className="h-5 w-5 mr-2" />
              View Reports Map
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-card p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <AlertTriangle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">1,247</h3>
                <p className="text-muted-foreground">Reports Submitted</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-card p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <CheckCircle className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">892</h3>
                <p className="text-muted-foreground">Issues Resolved</p>
              </div>
            </div>
          </Card>
          
          <Card className="bg-card/50 backdrop-blur-sm border-border shadow-card p-6 hover:shadow-glow transition-all duration-300">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-gradient-primary rounded-lg">
                <Users className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-foreground">5,634</h3>
                <p className="text-muted-foreground">Active Citizens</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-card/30 backdrop-blur-sm border-border p-6 text-center hover:shadow-card transition-all duration-300">
            <div className="p-4 bg-gradient-accent rounded-lg inline-block mb-4">
              <Camera className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Smart Detection</h3>
            <p className="text-muted-foreground text-sm">AI-powered image analysis to identify unauthorized billboards</p>
          </Card>
          
          <Card className="bg-card/30 backdrop-blur-sm border-border p-6 text-center hover:shadow-card transition-all duration-300">
            <div className="p-4 bg-gradient-accent rounded-lg inline-block mb-4">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Geo-tagging</h3>
            <p className="text-muted-foreground text-sm">Precise location tracking with timestamp for every report</p>
          </Card>
          
          <Card className="bg-card/30 backdrop-blur-sm border-border p-6 text-center hover:shadow-card transition-all duration-300">
            <div className="p-4 bg-gradient-accent rounded-lg inline-block mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Citizen Engagement</h3>
            <p className="text-muted-foreground text-sm">Community-driven reporting and monitoring system</p>
          </Card>
          
          <Card className="bg-card/30 backdrop-blur-sm border-border p-6 text-center hover:shadow-card transition-all duration-300">
            <div className="p-4 bg-gradient-accent rounded-lg inline-block mb-4">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">Real-time Alerts</h3>
            <p className="text-muted-foreground text-sm">Instant notifications for authorities and stakeholders</p>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Hero;
