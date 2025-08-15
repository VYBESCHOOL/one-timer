"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

type User = {
  id: string
  email: string
  name: string
}

type AuthContextType = {
  user: User | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  signUp: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  signOut: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("focusone-user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
    setLoading(false)
  }, [])

  const signIn = async (email: string, password: string) => {
    const users = JSON.parse(localStorage.getItem("focusone-users") || "[]")
    const user = users.find((u: any) => u.email === email && u.password === password)

    if (user) {
      const userData = { id: user.id, email: user.email, name: user.name }
      setUser(userData)
      localStorage.setItem("focusone-user", JSON.stringify(userData))
      return { success: true }
    }

    return { success: false, error: "Invalid email or password" }
  }

  const signUp = async (email: string, password: string, name: string) => {
    const users = JSON.parse(localStorage.getItem("focusone-users") || "[]")

    if (users.find((u: any) => u.email === email)) {
      return { success: false, error: "User already exists" }
    }

    const newUser = {
      id: Date.now().toString(),
      email,
      password,
      name,
    }

    users.push(newUser)
    localStorage.setItem("focusone-users", JSON.stringify(users))

    const userData = { id: newUser.id, email: newUser.email, name: newUser.name }
    setUser(userData)
    localStorage.setItem("focusone-user", JSON.stringify(userData))

    return { success: true }
  }

  const signOut = () => {
    setUser(null)
    localStorage.removeItem("focusone-user")
  }

  return <AuthContext.Provider value={{ user, signIn, signUp, signOut, loading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
