"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Activity,
    LogOut,
    Shield,
    CheckCircle,
    AlertTriangle,
} from "lucide-react"
import Link from "next/link"
import { MobileNav } from "@/components/MobileNav"
import { ProfileHeader } from "@/components/profile/profile-header"
import { ActivityList } from "@/components/profile/activity-list"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface ProfileData {
    user: {
        name: string
        email: string
        createdAt: string
        badges: string[]
    }
    stats: {
        totalReports: number
        complianceRate: number
        points: number
    }
    recentActivity: any[]
}

export default function ProfilePage() {
    const { user, logout, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    const fetchProfile = async () => {
        try {
            const res = await fetch("/api/user/profile", { cache: "no-store" })
            if (!res.ok) {
                const errorText = await res.text()
                throw new Error(`API Error: ${res.status} ${res.statusText} - ${errorText}`)
            }
            const data = await res.json()
            if (data.user) {
                setProfile(data)
            } else {
                throw new Error("Invalid data format received")
            }
        } catch (error) {
            console.error("Failed to fetch profile:", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (user) {
            fetchProfile()
        } else if (!authLoading) {
            setIsLoading(false)
        }
    }, [user, authLoading])

    if (isLoading || authLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
                <Card className="w-full max-w-md hover:shadow-glow transition-all duration-300">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-primary/10 p-3 rounded-full w-fit mb-4">
                            <Shield className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl">Sign In Required</CardTitle>
                        <CardDescription>
                            Please sign in to view your profile, track your reports, and see your stats.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <Link href="/login" className="w-full block">
                            <Button className="w-full" size="lg">
                                Sign In
                            </Button>
                        </Link>
                        <Link href="/" className="w-full block">
                            <Button variant="ghost" className="w-full">
                                Return Home
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <p className="text-muted-foreground">Failed to load profile data.</p>
                <Button onClick={() => window.location.reload()}>Retry</Button>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">BillboardGuard</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="hidden md:flex items-center gap-4">
                            <Link href="/dashboard">
                                <Button variant="ghost" size="sm">Dashboard</Button>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={() => {
                                logout()
                                router.push("/login")
                            }}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                        <MobileNav
                            items={[
                                { title: "Home", href: "/" },
                                { title: "Dashboard", href: "/dashboard" },
                                { title: "Public Data", href: "/public-dashboard" },
                            ]}
                            isLoggedIn={!!user}
                            onLogout={logout}
                        />
                    </div>
                </div>

            </header>

            <main className="container mx-auto px-4 py-8">
                {/* Profile Header */}
                <ProfileHeader
                    user={profile.user}
                    stats={profile.stats}
                    onUpdate={fetchProfile}
                />

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: Stats & Settings */}
                    <div className="md:col-span-1 space-y-6 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
                        <div className="grid grid-cols-1 gap-4">
                            <Card className="hover:shadow-md transition-all duration-300 hover:border-primary/30">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Reports</p>
                                            <p className="text-2xl font-bold">{profile.stats.totalReports}</p>
                                        </div>
                                        <Activity className="h-8 w-8 text-blue-500 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card className="hover:shadow-md transition-all duration-300 hover:border-primary/30">
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Compliance</p>
                                            <p className="text-2xl font-bold">{profile.stats.complianceRate}%</p>
                                        </div>
                                        <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Danger Zone */}
                        <Card className="border-destructive/50 bg-destructive/5">
                            <CardHeader>
                                <CardTitle className="text-base text-destructive flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4" />
                                    Danger Zone
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-muted-foreground mb-4">
                                    Permanently delete your account and all data.
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button variant="destructive" size="sm" className="w-full">Delete Account</Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete your account
                                                and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction
                                                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                onClick={async () => {
                                                    try {
                                                        const res = await fetch("/api/user/delete", {
                                                            method: "DELETE",
                                                        })
                                                        if (res.ok) {
                                                            logout()
                                                            router.push("/")
                                                        } else {
                                                            alert("Failed to delete account")
                                                        }
                                                    } catch (error) {
                                                        console.error("Error deleting account:", error)
                                                        alert("An error occurred")
                                                    }
                                                }}
                                            >
                                                Delete Account
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Activity Tabs */}
                    <div className="md:col-span-2">
                        <Tabs defaultValue="activity" className="space-y-4">
                            <TabsList>
                                <TabsTrigger value="activity">Recent Activity</TabsTrigger>
                                {/* Future tabs: <TabsTrigger value="settings">Settings</TabsTrigger> */}
                            </TabsList>
                            <TabsContent value="activity">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Submission History</CardTitle>
                                        <CardDescription>Your latest billboard violation reports.</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <ActivityList activities={profile.recentActivity} />
                                    </CardContent>
                                </Card>
                            </TabsContent>
                        </Tabs>
                    </div>
                </div>
            </main>
        </div>
    )
}
