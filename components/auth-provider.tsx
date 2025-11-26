"use client"

import type React from "react"
import { createContext, useContext } from "react"
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"

interface User {
  id: string
  email: string
  name?: string
  image?: string
  role?: string // Add role to session user type if needed
}

interface AuthContextType {
  user: User | null
  login: (data: any) => Promise<any> // Deprecated in favor of direct signIn
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function AuthProviderContent({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  const user = session?.user ? { ...session.user, id: session.user.id || '' } : null
  const isLoading = status === "loading"

  const login = async (data: any) => {
    // This is a compatibility wrapper. Ideally use signIn directly.
    return await signIn("credentials", { ...data, redirect: false })
  }

  const logout = async () => {
    await signOut({ callbackUrl: window.location.origin })
  }

  return (
    <AuthContext.Provider value={{ user: user as User | null, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  )
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthProviderContent>{children}</AuthProviderContent>
    </SessionProvider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
