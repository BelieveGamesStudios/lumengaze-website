"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient()
      const { data } = await supabase.auth.getUser()

      if (!data.user) {
        router.push("/auth/login")
      } else {
        setUser(data.user)
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/")
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  const navItems = [
    { label: "Dashboard", href: "/admin", icon: "📊" },
    { label: "Projects", href: "/admin/projects", icon: "🎨" },
    { label: "Blog Posts", href: "/admin/blog", icon: "📝" },
    { label: "Partners", href: "/admin/partners", icon: "🤝" },
    { label: "Events", href: "/admin/events", icon: "📅" },
    { label: "Careers", href: "/admin/careers", icon: "💼" },
    { label: "Contact Submissions", href: "/admin/contact", icon: "💬" },
  ]

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? "w-64" : "w-20"
        } glass border-r border-white/10 transition-all duration-300 flex flex-col`}
      >
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          {sidebarOpen && <h1 className="font-bold gradient-text">LumenGaze</h1>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/10 rounded-lg transition">
            {sidebarOpen ? "←" : "→"}
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/20 transition text-sm"
            >
              <span className="text-lg">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-primary/20 transition text-sm w-full"
          >
            <span className="text-lg">🏠</span>
            {sidebarOpen && <span>Back to Home</span>}
          </Link>
          <Button onClick={handleLogout} variant="outline" size="sm" className="w-full bg-transparent text-xs">
            {sidebarOpen ? "Logout" : "🚪"}
          </Button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">{children}</div>
      </div>
    </div>
  )
}
