"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, Shield } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"

interface NavItem {
    title: string
    href: string
    icon?: React.ReactNode
}

interface MobileNavProps {
    items: NavItem[]
    isLoggedIn?: boolean
    onLogout?: () => void
}

export function MobileNav({ items, isLoggedIn, onLogout }: MobileNavProps) {
    const [open, setOpen] = React.useState(false)

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
                <Button
                    variant="ghost"
                    className="mr-2 px-0 text-base hover:bg-transparent focus-visible:bg-transparent focus-visible:ring-0 focus-visible:ring-offset-0 md:hidden"
                >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Toggle Menu</span>
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <SheetHeader className="px-1 text-left">
                    <SheetTitle className="flex items-center">
                        <Shield className="h-6 w-6 text-primary mr-2" />
                        <span className="font-bold">BillboardGuard</span>
                    </SheetTitle>
                </SheetHeader>
                <div className="my-4 pb-10 pl-1 pr-6">
                    <div className="flex flex-col space-y-4">
                        {items.map((item, index) => (
                            <div key={index}>
                                <Link
                                    href={item.href}
                                    className="flex items-center py-2 text-lg font-medium transition-colors hover:text-primary"
                                    onClick={() => setOpen(false)}
                                >
                                    {item.title}
                                </Link>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 border-t pt-4">
                        {isLoggedIn ? (
                            <Button
                                variant="ghost"
                                className="justify-start px-0 text-lg font-medium text-destructive hover:text-destructive hover:bg-transparent"
                                onClick={() => {
                                    if (onLogout) onLogout()
                                    setOpen(false)
                                }}
                            >
                                Sign Out
                            </Button>
                        ) : (
                            <div className="flex flex-col space-y-2">
                                <Link href="/login" onClick={() => setOpen(false)}>
                                    <Button variant="ghost" className="justify-start px-0 text-lg">
                                        Sign In
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    )
}
