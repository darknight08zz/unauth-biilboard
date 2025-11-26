"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Shield, BarChart3, MapPin, Upload, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "../components/ui/button"
import { useAuth } from "@/components/auth-provider"

export default function LandingPage() {
  const { user, logout } = useAuth()

  return (
    <div className="flex flex-col min-h-screen">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <Link className="flex items-center justify-center" href="/">
          <Shield className="h-6 w-6 text-primary mr-2" />
          <span className="font-bold text-xl">BillboardGuard</span>
        </Link>
        <nav className="ml-auto flex gap-4 sm:gap-6 items-center">
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#features">
            Features
          </Link>
          <Link className="text-sm font-medium hover:text-primary transition-colors" href="#how-it-works">
            How It Works
          </Link>
          {user ? (
            <>
              <Link className="text-sm font-medium hover:text-primary transition-colors flex items-center" href="/dashboard">
                <LayoutDashboard className="h-4 w-4 mr-1" />
                Dashboard
              </Link>
              <button
                onClick={() => logout()}
                className="text-sm font-medium hover:text-primary transition-colors flex items-center"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Sign Out
              </button>
            </>
          ) : (
            <Link className="text-sm font-medium hover:text-primary transition-colors" href="/login">
              Sign In
            </Link>
          )}
        </nav>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-gradient-to-b from-background to-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center space-y-4 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                  AI-Powered Billboard Compliance
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Automate billboard inspections, detect violations instantly, and ensure regulatory compliance with our advanced AI analysis platform.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button size="lg" className="h-12 px-8">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/public-dashboard">
                  <Button variant="outline" size="lg" className="h-12 px-8">
                    View Public Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-background">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <div className="inline-block rounded-lg bg-muted px-3 py-1 text-sm">Key Features</div>
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything you need for compliance</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Our platform combines computer vision with regulatory databases to provide instant, accurate assessments.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3 lg:gap-12">
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <CheckCircle className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Instant Analysis</h3>
                <p className="text-muted-foreground">
                  Upload an image and get immediate feedback on compliance status, potential violations, and risk levels.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <BarChart3 className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Detailed Reporting</h3>
                <p className="text-muted-foreground">
                  Generate comprehensive PDF reports with violation details, fine estimates, and actionable insights.
                </p>
              </div>
              <div className="flex flex-col items-center space-y-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold">Geo-Tagging</h3>
                <p className="text-muted-foreground">
                  Automatically map violations and track compliance across different zones and jurisdictions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-muted/50">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">How It Works</h2>
                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                  Simple, fast, and effective compliance monitoring in three steps.
                </p>
              </div>
            </div>
            <div className="mx-auto grid max-w-5xl items-center gap-6 py-12 lg:grid-cols-3">
              <div className="relative flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  1
                </div>
                <h3 className="text-xl font-bold">Upload Image</h3>
                <p className="text-muted-foreground">
                  Take a photo or upload an existing image of the billboard you want to inspect.
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  2
                </div>
                <h3 className="text-xl font-bold">AI Analysis</h3>
                <p className="text-muted-foreground">
                  Our AI scans the image for violations against local zoning and advertising regulations.
                </p>
              </div>
              <div className="relative flex flex-col items-center space-y-4 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-xl">
                  3
                </div>
                <h3 className="text-xl font-bold">Get Report</h3>
                <p className="text-muted-foreground">
                  Receive a detailed compliance report with pass/fail status and recommended actions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 md:py-24 lg:py-32 bg-primary text-primary-foreground">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center justify-center space-y-4 text-center">
              <div className="space-y-2">
                <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
                  Ready to streamline your compliance?
                </h2>
                <p className="mx-auto max-w-[600px] text-primary-foreground/90 md:text-xl">
                  Join inspectors and city planners using BillboardGuard to maintain visual order.
                </p>
              </div>
              <div className="space-x-4">
                <Link href="/dashboard">
                  <Button size="lg" variant="secondary" className="h-12 px-8 text-primary">
                    Start Analyzing Now
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center px-4 md:px-6 border-t">
        <p className="text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} BillboardGuard. All rights reserved.
        </p>
        <nav className="sm:ml-auto flex gap-4 sm:gap-6">
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Terms of Service
          </Link>
          <Link className="text-xs hover:underline underline-offset-4" href="#">
            Privacy
          </Link>
        </nav>
      </footer>
    </div>
  )
}
