"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Medal, Award, Star, ArrowLeft } from "lucide-react"
import NextLink from "next/link"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/components/auth-provider"
import { MobileNav } from "@/components/MobileNav"

interface LeaderboardUser {
    _id: string
    name: string
    points: number
    badges: string[]
}

export default function LeaderboardPage() {
    const { user, logout } = useAuth()
    const [users, setUsers] = useState<LeaderboardUser[]>([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard")
                if (res.ok) {
                    const data = await res.json()
                    setUsers(data)
                }
            } catch (error) {
                console.error("Failed to fetch leaderboard", error)
            } finally {
                setIsLoading(false)
            }
        }

        fetchLeaderboard()
    }, [])

    const getRankIcon = (index: number) => {
        switch (index) {
            case 0:
                return <Trophy className="h-6 w-6 text-yellow-500" />
            case 1:
                return <Medal className="h-6 w-6 text-gray-400" />
            case 2:
                return <Medal className="h-6 w-6 text-amber-600" />
            default:
                return <span className="text-lg font-bold text-muted-foreground w-6 text-center">{index + 1}</span>
        }
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="border-b bg-card">
                <div className="container mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-lg">
                        <Trophy className="h-5 w-5 text-primary" />
                        Leaderboard
                    </div>
                    <div className="hidden md:block">
                        <NextLink href="/dashboard">
                            <Button variant="ghost">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Return to Dashboard
                            </Button>
                        </NextLink>
                    </div>
                    <MobileNav
                        items={[
                            { title: "Home", href: "/" },
                            { title: "Dashboard", href: "/dashboard" },
                            ...(user ? [{ title: "Profile", href: "/profile" }] : []),
                        ]}
                        isLoggedIn={!!user}
                        onLogout={logout}
                    />
                </div>
            </header>

            <div className="container mx-auto px-4 py-8 space-y-8">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold tracking-tight text-primary">Community Leaderboard</h1>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Top contributors helping to keep our city compliant. Earn points by submitting verified reports!
                    </p>
                </div>

                <Card className="max-w-3xl mx-auto">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Star className="h-5 w-5 text-yellow-500" />
                            Top Inspectors
                        </CardTitle>
                        <CardDescription>Ranked by total contribution points</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="text-center py-8 text-muted-foreground">Loading leaderboard...</div>
                        ) : (
                            <div className="space-y-4">
                                {users.map((user, index) => (
                                    <div
                                        key={user._id}
                                        className="flex items-center justify-between p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center justify-center w-8">{getRankIcon(index)}</div>
                                            <Avatar className="h-10 w-10 border-2 border-background">
                                                <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} />
                                                <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="font-semibold">{user.name}</p>
                                                <div className="flex gap-2 mt-1">
                                                    {user.badges.map((badge) => (
                                                        <Badge key={badge} variant="secondary" className="text-xs px-1 py-0 h-5">
                                                            {badge}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-xl font-bold text-primary">{user.points}</span>
                                            <span className="text-xs text-muted-foreground block">points</span>
                                        </div>
                                    </div>
                                ))}
                                {users.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground">No contributors yet. Be the first!</div>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
