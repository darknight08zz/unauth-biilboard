"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { Home, Globe, Camera, Trophy, User } from "lucide-react"

import { cn } from "@/lib/utils"

export function BottomNav() {
    const pathname = usePathname()
    const router = useRouter()

    const items = [
        {
            title: "Home",
            href: "/dashboard",
            icon: Home,
        },
        {
            title: "Public",
            href: "/public-dashboard",
            icon: Globe,
        },
        {
            title: "Scan",
            href: "/dashboard",
            icon: Camera,
            isFab: true,
        },
        {
            title: "Leaderboard",
            href: "/leaderboard",
            icon: Trophy,
        },
        {
            title: "Profile",
            href: "/profile",
            icon: User,
        },
    ]

    const handleFabClick = (e: React.MouseEvent) => {
        e.preventDefault()
        if (pathname === "/dashboard") {
            // If already on dashboard, trigger camera directly
            const event = new CustomEvent("trigger-camera")
            window.dispatchEvent(event)
        } else {
            // If not on dashboard, navigate there with a query param to trigger camera
            // For now, simple navigation, dashboard will handle button click if needed
            // Ideally, dashboard could check query param on mount to auto-trigger,
            // but the user's primary "Scan" flow assumes being on dashboard.
            // Let's stick to nav for simplicity, or we can use a query param 'trigger=camera'
            router.push("/dashboard?trigger=camera")
        }
    }

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-t border-border/50 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16 px-2">
                {items.map((item) => {
                    const isActive = pathname === item.href

                    if (item.isFab) {
                        return (
                            <div key={item.title} className="relative -top-5">
                                <button
                                    onClick={handleFabClick}
                                    className="flex flex-col items-center justify-center w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)] border-4 border-background animate-pulse-glow hover:scale-105 transition-transform"
                                >
                                    <item.icon className="w-6 h-6" />
                                </button>
                                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] font-medium text-muted-foreground whitespace-nowrap">
                                    Scan
                                </span>
                            </div>
                        )
                    }

                    return (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center w-16 h-full space-y-1 transition-colors",
                                isActive
                                    ? "text-primary hover:text-primary/90"
                                    : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            <item.icon className={cn("w-5 h-5", isActive && "fill-current/20")} />
                            <span className="text-[10px] font-medium">{item.title}</span>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
