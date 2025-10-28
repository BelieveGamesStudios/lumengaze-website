"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    projects: 0,
    blogPosts: 0,
    partners: 0,
    events: 0,
    contacts: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStats = async () => {
      const supabase = createClient()

      const [projectsRes, blogRes, partnersRes, eventsRes, contactsRes] = await Promise.all([
        supabase.from("projects").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("partners").select("id", { count: "exact", head: true }),
        supabase.from("events").select("id", { count: "exact", head: true }),
        supabase.from("contact_submissions").select("id", { count: "exact", head: true }),
      ])

      setStats({
        projects: projectsRes.count || 0,
        blogPosts: blogRes.count || 0,
        partners: partnersRes.count || 0,
        events: eventsRes.count || 0,
        contacts: contactsRes.count || 0,
      })
      setLoading(false)
    }

    fetchStats()
  }, [])

  const statCards = [
    { label: "Projects", value: stats.projects, icon: "🎨" },
    { label: "Blog Posts", value: stats.blogPosts, icon: "📝" },
    { label: "Partners", value: stats.partners, icon: "🤝" },
    { label: "Events", value: stats.events, icon: "📅" },
    { label: "Contact Submissions", value: stats.contacts, icon: "💬" },
  ]

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 gradient-text">Dashboard</h1>

      {loading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {statCards.map((stat) => (
            <Card key={stat.label} className="glass border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-3xl font-bold">{stat.value}</div>
                  <div className="text-3xl">{stat.icon}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <div className="mt-12">
        <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <a
            href="/admin/projects?action=create"
            className="glass border-white/20 p-6 rounded-lg hover:border-primary/50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">🎨</div>
            <h3 className="font-semibold mb-1">Create Project</h3>
            <p className="text-sm text-muted-foreground">Add a new AR project</p>
          </a>
          <a
            href="/admin/blog?action=create"
            className="glass border-white/20 p-6 rounded-lg hover:border-primary/50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">📝</div>
            <h3 className="font-semibold mb-1">Write Blog Post</h3>
            <p className="text-sm text-muted-foreground">Publish new content</p>
          </a>
          <a
            href="/admin/events?action=create"
            className="glass border-white/20 p-6 rounded-lg hover:border-primary/50 transition cursor-pointer"
          >
            <div className="text-3xl mb-2">📅</div>
            <h3 className="font-semibold mb-1">Create Event</h3>
            <p className="text-sm text-muted-foreground">Schedule new event</p>
          </a>
        </div>
      </div>
    </div>
  )
}
