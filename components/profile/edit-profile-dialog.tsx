"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Camera, Upload, Trash } from "lucide-react"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface EditProfileDialogProps {
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
    }
    onUpdate: () => void
}

export function EditProfileDialog({ user, onUpdate }: EditProfileDialogProps) {
    const [formData, setFormData] = useState({
        name: user.name || "",
        bio: user.bio || "",
        location: user.location || "",
        phone: user.phone || "",
        website: user.website || "",
        socials: {
            twitter: user.socials?.twitter || "",
            linkedin: user.socials?.linkedin || "",
            github: user.socials?.github || "",
        }
    })
    const [imagePreview, setImagePreview] = useState<string | null>(user.image || null)
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const { toast } = useToast()

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            // Compress image before setting preview/uploading
            const reader = new FileReader()
            reader.onload = (event) => {
                try {
                    const img = new Image()
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        const MAX_WIDTH = 300
                        const MAX_HEIGHT = 300
                        let width = img.width
                        let height = img.height

                        if (width > height) {
                            if (width > MAX_WIDTH) {
                                height *= MAX_WIDTH / width
                                width = MAX_WIDTH
                            }
                        } else {
                            if (height > MAX_HEIGHT) {
                                width *= MAX_HEIGHT / height
                                height = MAX_HEIGHT
                            }
                        }

                        canvas.width = width
                        canvas.height = height
                        const ctx = canvas.getContext('2d')
                        ctx?.drawImage(img, 0, 0, width, height)

                        const dataUrl = canvas.toDataURL('image/jpeg', 0.7)
                        setImagePreview(dataUrl)
                        // alert("Image processed successfully") 
                    }
                    img.src = event.target?.result as string
                } catch (e) {
                    console.error("Error processing image: ", e)
                }
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSave = async () => {
        try {
            setIsLoading(true)
            // alert("Starting save...")

            const payload = {
                ...formData,
                image: imagePreview
            }

            const res = await fetch("/api/user/profile", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || "Failed to update profile")
            }

            // Fallback alert if toast fails
            // alert("Profile updated successfully!")

            toast({
                title: "Profile updated",
                description: "Your changes have been saved successfully.",
            })

            setOpen(false)
            onUpdate() // Refresh parent data
            router.refresh()
        } catch (error) {
            console.error("Error updating profile:", error)
            // alert("Error: " + (error as Error).message) // Direct alert for visibility
            toast({
                variant: "destructive",
                title: "Error",
                description: (error as Error).message || "Something went wrong. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Settings className="h-4 w-4 mr-2" />
                    Edit Profile
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] h-[80vh] flex flex-col p-0 gap-0 overflow-hidden">
                <DialogHeader className="px-6 py-4 border-b">
                    <DialogTitle>Edit Profile</DialogTitle>
                    <DialogDescription>
                        Update your personal details and public profile.
                    </DialogDescription>
                </DialogHeader>

                <div className="flex-1 overflow-y-auto p-6">
                    <Tabs defaultValue="general" className="w-full">
                        <TabsList className="w-full justify-start mb-4">
                            <TabsTrigger value="general">General</TabsTrigger>
                            <TabsTrigger value="social">Social Links</TabsTrigger>
                        </TabsList>

                        <TabsContent value="general" className="space-y-6">
                            {/* Image Upload */}
                            <div className="flex flex-col items-center gap-4">
                                <div className="relative group">
                                    <Avatar className="h-24 w-24 cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                        <AvatarImage src={imagePreview || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.email}`} />
                                        <AvatarFallback>{user.name[0]}</AvatarFallback>
                                        <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Camera className="h-8 w-8 text-white" />
                                        </div>
                                    </Avatar>
                                </div>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
                                        <Upload className="h-3 w-3 mr-2" />
                                        Change Photo
                                    </Button>
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                    />
                                    {imagePreview && (
                                        <Button variant="ghost" size="sm" onClick={() => setImagePreview(null)}>
                                            <Trash className="h-3 w-3 text-destructive" />
                                        </Button>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="name">Display Name</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="bio">Bio</Label>
                                <Textarea
                                    id="bio"
                                    placeholder="Tell us a little about yourself"
                                    className="resize-none"
                                    maxLength={160}
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                />
                                <p className="text-xs text-muted-foreground text-right">
                                    {formData.bio.length}/160 characters
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="location">Location</Label>
                                    <Input
                                        id="location"
                                        placeholder="City, Country"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="phone">Phone (Optional)</Label>
                                    <Input
                                        id="phone"
                                        placeholder="+1 234 567 890"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                    />
                                </div>
                            </div>
                        </TabsContent>

                        <TabsContent value="social" className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="website">Personal Website</Label>
                                <Input
                                    id="website"
                                    placeholder="https://yourwebsite.com"
                                    value={formData.website}
                                    onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="twitter">Twiter / X Profile</Label>
                                <Input
                                    id="twitter"
                                    placeholder="@username"
                                    value={formData.socials.twitter}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socials: { ...formData.socials, twitter: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="linkedin">LinkedIn Profile</Label>
                                <Input
                                    id="linkedin"
                                    placeholder="linkedin.com/in/username"
                                    value={formData.socials.linkedin}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socials: { ...formData.socials, linkedin: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="github">GitHub Profile</Label>
                                <Input
                                    id="github"
                                    placeholder="github.com/username"
                                    value={formData.socials.github}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        socials: { ...formData.socials, github: e.target.value }
                                    })}
                                />
                            </div>
                        </TabsContent>
                    </Tabs>
                </div>

                <DialogFooter className="px-6 py-4 border-t bg-muted/50">
                    <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                    <Button type="submit" onClick={handleSave} disabled={isLoading}>
                        {isLoading ? "Saving..." : "Save Changes"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
