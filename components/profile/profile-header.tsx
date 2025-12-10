"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Award, Calendar, Star, Trophy, MapPin, Globe, Twitter, Linkedin, Github } from "lucide-react"
import { EditProfileDialog } from "./edit-profile-dialog"

interface ProfileHeaderProps {
    user: {
        name: string
        email: string
        image?: string
        bio?: string
        location?: string
        phone?: string
        website?: string
        socials?: {
            twitter?: string
            linkedin?: string
            github?: string
        }
        createdAt: string
        badges: string[]
    }
    stats: {
        totalReports: number
        complianceRate: number
        points: number
    }
    onUpdate: () => void
}

export function ProfileHeader({ user, stats, onUpdate }: ProfileHeaderProps) {
    const level = Math.floor(stats.points / 100) + 1
    const pointsToNextLevel = 100 - (stats.points % 100)
    const progress = stats.points % 100

    return (
        <Card className="mb-8">
            <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row items-start gap-6">
                    <div className="relative">
                        <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                            <AvatarImage src={user.image || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                            <AvatarFallback>{user.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="absolute -bottom-2 -right-2 bg-primary text-primary-foreground text-xs font-bold px-2 py-1 rounded-full shadow-md">
                            Lvl {level}
                        </div>
                    </div>

                    <div className="flex-1 space-y-4 w-full">
                        <div className="flex flex-col md:flex-row items-start justify-between gap-4">
                            <div>
                                <h2 className="text-2xl font-bold">{user.name}</h2>
                                <p className="text-muted-foreground">{user.email}</p>
                                {user.bio && <p className="mt-2 text-sm max-w-lg">{user.bio}</p>}
                            </div>
                            <EditProfileDialog user={user} onUpdate={onUpdate} />
                        </div>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            {user.location && (
                                <div className="flex items-center gap-1">
                                    <MapPin className="h-4 w-4" />
                                    <span>{user.location}</span>
                                </div>
                            )}
                            <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 pt-2">
                            {user.website && (
                                <a href={user.website.startsWith('http') ? user.website : `https://${user.website}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Globe className="h-4 w-4" />
                                </a>
                            )}
                            {user.socials?.twitter && (
                                <a href={`https://twitter.com/${user.socials.twitter.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Twitter className="h-4 w-4" />
                                </a>
                            )}
                            {user.socials?.linkedin && (
                                <a href={user.socials.linkedin.startsWith('http') ? user.socials.linkedin : `https://${user.socials.linkedin}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Linkedin className="h-4 w-4" />
                                </a>
                            )}
                            {user.socials?.github && (
                                <a href={`https://github.com/${user.socials.github}`} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
                                    <Github className="h-4 w-4" />
                                </a>
                            )}
                        </div>
                    </div>

                    <div className="w-full md:w-64 space-y-2 mt-4 md:mt-0 bg-muted/20 p-4 rounded-lg border">
                        <div className="flex justify-between items-center mb-2">
                            <span className="font-bold flex items-center gap-2">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {stats.points} Points
                            </span>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Level {level}</span>
                            <span>{pointsToNextLevel} to next</span>
                        </div>
                        <Progress value={progress} className="h-2" />
                        <div className="pt-2">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Badges</p>
                            <div className="flex flex-wrap gap-2">
                                {user.badges.length > 0 ? user.badges.map((badge, i) => (
                                    <Badge key={i} variant="secondary" className="whitespace-nowrap flex items-center gap-1 text-[10px] py-0 h-5">
                                        <Trophy className="h-2 w-2 text-yellow-500" />
                                        {badge}
                                    </Badge>
                                )) : (
                                    <span className="text-xs text-muted-foreground italic">No badges yet</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
