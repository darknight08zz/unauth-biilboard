"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    User,
    MapPin,
    Calendar,
    Award,
    Trophy,
    Star,
    Activity,
    LogOut,
    Shield,
    CheckCircle,
    AlertTriangle,
    Clock
} from "lucide-react"
import Link from "next/link"

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
    const { user, logout } = useAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<ProfileData | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await fetch("/api/user/profile")
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
                // You might want to set an error state here to display a specific message
            } finally {
                setIsLoading(false)
            }
        }

        fetchProfile()
    }, [])

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                        <Link href="/dashboard" className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-lg">
                                <Shield className="h-6 w-6 text-primary" />
                            </div>
                            <span className="text-lg font-bold tracking-tight">BillboardGuard</span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
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
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Left Column: User Info */}
                    <div className="md:col-span-1 space-y-6">
                        <Card>
                            <CardContent className="pt-6 flex flex-col items-center text-center">
                                <Avatar className="h-24 w-24 mb-4">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${profile.user.email}`} />
                                    <AvatarFallback>{profile.user.name[0]}</AvatarFallback>
                                </Avatar>
                                <h2 className="text-2xl font-bold">{profile.user.name}</h2>
                                <p className="text-muted-foreground">{profile.user.email}</p>
                                <div className="flex items-center gap-2 mt-4 text-sm text-muted-foreground">
                                    <Calendar className="h-4 w-4" />
                                    <span>Joined {new Date(profile.user.createdAt).toLocaleDateString()}</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Trophy className="h-5 w-5 text-yellow-500" />
                                    Badges Earned
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {profile.user.badges.length > 0 ? (
                                        profile.user.badges.map((badge, i) => (
                                            <Badge key={i} variant="secondary" className="flex items-center gap-1">
                                                <Award className="h-3 w-3" />
                                                {badge}
                                            </Badge>
                                        ))
                                    ) : (
                                        <p className="text-sm text-muted-foreground">No badges yet. Start reporting!</p>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Right Column: Stats & Activity */}
                    <div className="md:col-span-2 space-y-6">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Total Points</p>
                                            <p className="text-2xl font-bold text-primary">{profile.stats.points}</p>
                                        </div>
                                        <Star className="h-8 w-8 text-yellow-500 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Reports Submitted</p>
                                            <p className="text-2xl font-bold">{profile.stats.totalReports}</p>
                                        </div>
                                        <Activity className="h-8 w-8 text-blue-500 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="pt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-muted-foreground">Compliance Rate</p>
                                            <p className="text-2xl font-bold">{profile.stats.complianceRate}%</p>
                                        </div>
                                        <CheckCircle className="h-8 w-8 text-green-500 opacity-50" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Activity Tabs */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Activity</CardTitle>
                                <CardDescription>Your latest billboard submissions and their status</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {profile.recentActivity.map((report) => (
                                        <div key={report._id} className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className={`p-2 rounded-full ${report.analysis.compliant ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                                                    {report.analysis.compliant ? <CheckCircle className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
                                                </div>
                                                <div>
                                                    <p className="font-medium">{report.location || "Unknown Location"}</p>
                                                    <p className="text-xs text-muted-foreground">
                                                        {new Date(report.createdAt).toLocaleDateString()} • {report.analysis.compliant ? "Compliant" : "Violation Detected"}
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge variant={report.analysis.compliant ? "outline" : "destructive"}>
                                                {report.analysis.compliant ? "Approved" : "Pending Action"}
                                            </Badge>
                                        </div>
                                    ))}
                                    {profile.recentActivity.length === 0 && (
                                        <div className="text-center py-8 text-muted-foreground">
                                            No activity yet. Submit your first report!
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </main>
        </div>
    )
}
