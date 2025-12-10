"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, BarChart3, MapPin, Upload, LogOut, LayoutDashboard, Brain, Zap, Globe, User } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAuth } from "@/components/auth-provider"
import { MobileNav } from "@/components/MobileNav"
import { ModeToggle } from "@/components/mode-toggle"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LandingPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <Link className="flex items-center justify-center gap-2" href="/">
          <div className="bg-primary/10 p-2 rounded-lg">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <span className="font-bold text-xl hidden sm:inline-block tracking-tight">BillboardGuard</span>
        </Link>
        <div className="ml-auto flex items-center">
          <nav className="hidden md:flex gap-6 items-center mr-6">
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
              Features
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/public-dashboard">
              Public Data
            </Link>
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">
              How It Works
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <ModeToggle />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="ghost" size="sm" className="hidden sm:flex">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </Link>
                <Button variant="ghost" size="sm" onClick={() => logout()} className="hidden sm:flex">
                  <LogOut className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <Link href="/login">
                <Button size="sm" className="hidden sm:flex">Sign In</Button>
              </Link>
            )}

            <MobileNav
              items={[
                { title: "Features", href: "#features" },
                { title: "How It Works", href: "#how-it-works" },
                { title: "Public Data", href: "/public-dashboard" },
                ...(user ? [
                  { title: "Dashboard", href: "/dashboard" },
                  { title: "Profile", href: "/profile" }
                ] : [])
              ]}
              isLoggedIn={!!user}
              onLogout={logout}
            />
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full py-20 md:py-32 lg:py-48 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-background -z-10" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-primary/10 rounded-full blur-3xl -z-10 opacity-50 animate-pulse-glow" />

          <div className="container px-4 md:px-6 relative z-10">
            <div className="flex flex-col items-center space-y-8 text-center">
              <Badge variant="outline" className="px-4 py-1 text-sm rounded-full border-primary/50 text-primary bg-primary/5">
                BillBoardGuard
              </Badge>

              <div className="space-y-4 max-w-4xl animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s" }}>
                <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                  Architecting Urban Integrity with <span className="text-primary relative inline-block">
                    Intelligent Oversight
                    <span className="absolute inset-x-0 bottom-1 h-3 bg-primary/20 -z-10 skew-x-12" />
                  </span>
                </h1>
                <p className="mx-auto max-w-[800px] text-muted-foreground md:text-xl lg:text-2xl leading-relaxed animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s" }}>
                  Bridging the gap between civic ordinances and urban reality. We leverage advanced computer vision to democratize compliance, ensuring public spaces uphold the highest standards of safety and aesthetics.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full justify-center animate-fade-in-up opacity-0" style={{ animationDelay: "0.5s" }}>
                <Link href="/dashboard">
                  <Button size="lg" className="h-14 px-8 text-lg w-full sm:w-auto shadow-lg shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40">
                    Start Reporting
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href="/public-dashboard">
                  <Button variant="outline" size="lg" className="h-14 px-8 text-lg w-full sm:w-auto backdrop-blur-sm bg-background/50 hover:bg-background/80 transition-all">
                    View Public Map
                  </Button>
                </Link>
              </div>

              <div className="pt-8 flex items-center justify-center gap-8 text-muted-foreground">
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl text-foreground">1.2k+</span>
                  <span className="text-xs uppercase tracking-wider">Reports</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl text-foreground">98%</span>
                  <span className="text-xs uppercase tracking-wider">Accuracy</span>
                </div>
                <div className="h-8 w-px bg-border" />
                <div className="flex flex-col items-center">
                  <span className="font-bold text-2xl text-foreground">24/7</span>
                  <span className="text-xs uppercase tracking-wider">Monitoring</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-20 bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Feature-Packed Analysis</h2>
              <p className="mt-4 text-muted-foreground md:text-lg max-w-2xl mx-auto">
                Our technology does the heavy lifting so you don't have to. Advanced computer vision meets civic duty.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s" }}>
                <CardHeader>
                  <div className="bg-blue-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 ring-1 ring-blue-500/20">
                    <Brain className="h-6 w-6 text-blue-500" />
                  </div>
                  <CardTitle>AI Computer Vision</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Instantly detects billboard structures, measures dimensions, and identifies content violations effectively.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s" }}>
                <CardHeader>
                  <div className="bg-green-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 ring-1 ring-green-500/20">
                    <Zap className="h-6 w-6 text-green-500" />
                  </div>
                  <CardTitle>Real-time Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Get immediate feedback on submission. Track report status from "Investigating" to "Resolved" in real-time.
                  </p>
                </CardContent>
              </Card>

              <Card className="bg-background/60 backdrop-blur-sm border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-glow hover:-translate-y-1 animate-fade-in-up opacity-0" style={{ animationDelay: "0.6s" }}>
                <CardHeader>
                  <div className="bg-purple-500/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 ring-1 ring-purple-500/20">
                    <Globe className="h-6 w-6 text-purple-500" />
                  </div>
                  <CardTitle>Geo-Spatial Mapping</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Interactive public maps showing high-density violation zones and compliance trends across the city.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="w-full py-20 relative overflow-hidden">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="container px-4 md:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">Compliance in 3 Steps</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              {/* Connector Line (Desktop) */}
              <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-muted via-primary/50 to-muted -z-10 animate-fade-in opacity-0" style={{ animationDelay: "1s" }} />

              <div className="flex flex-col items-center text-center group animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s" }}>
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 group-hover:border-primary transition-colors shadow-lg group-hover:shadow-primary/20">
                  <Upload className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Upload Evidence</h3>
                <p className="text-muted-foreground max-w-xs">Take a clear photo of the billboard in question and upload it to our secure platform.</p>
              </div>

              <div className="flex flex-col items-center text-center group animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s" }}>
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 group-hover:border-primary transition-colors shadow-lg group-hover:shadow-primary/20">
                  <Brain className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. AI Processing</h3>
                <p className="text-muted-foreground max-w-xs">Our algorithms analyze the image for zoning rule violations, content issues, and safety hazards.</p>
              </div>

              <div className="flex flex-col items-center text-center group animate-fade-in-up opacity-0" style={{ animationDelay: "0.6s" }}>
                <div className="w-24 h-24 rounded-full bg-background border-4 border-muted flex items-center justify-center mb-6 group-hover:border-primary transition-colors shadow-lg group-hover:shadow-primary/20">
                  <CheckCircle className="h-10 w-10 text-muted-foreground group-hover:text-primary transition-colors duration-300" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Action Taken</h3>
                <p className="text-muted-foreground max-w-xs">Reports are verified and sent to city officials. You earn points and badges for your contribution!</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-24 bg-primary text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-10" />
          <div className="container px-4 md:px-6 relative z-10 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-6">
              Ready to make a difference?
            </h2>
            <p className="mx-auto max-w-[600px] text-primary-foreground/80 md:text-xl mb-10">
              Join thousands of citizens cleaning up our skyline one report at a time.
            </p>
            <Link href="/dashboard">
              <Button size="lg" variant="secondary" className="h-14 px-8 text-lg shadow-xl hover:shadow-2xl transition-all hover:scale-105 animate-pulse-glow">
                Launch Dashboard
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <footer className="w-full py-6 px-4 md:px-6 border-t bg-background">
        <div className="container flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} BillboardGuard.
            </p>
          </div>

          <nav className="flex gap-4 sm:gap-6">
            <Link className="text-sm text-muted-foreground hover:underline underline-offset-4" href="#">
              Terms
            </Link>
            <Link className="text-sm text-muted-foreground hover:underline underline-offset-4" href="#">
              Privacy
            </Link>
            <Link className="text-sm text-muted-foreground hover:underline underline-offset-4" href="#">
              Contact
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  )
}
