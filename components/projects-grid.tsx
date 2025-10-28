"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

interface Project {
  id: string
  title: string
  description: string
  category: string
  thumbnail_url: string | null
  featured: boolean
  reality_type?: string
}

export function ProjectsGrid() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedRealityType, setSelectedRealityType] = useState("All")
  const [categories, setCategories] = useState<string[]>([])
  const realityTypes = ["All", "AR", "VR", "MR"]

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false })

      setProjects(data || [])

      // Extract unique categories
      const uniqueCategories = ["All", ...new Set((data || []).map((p) => p.category))]
      setCategories(uniqueCategories as string[])

      setLoading(false)
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    let filtered = projects

    // Filter by category
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory)
    }

    if (selectedRealityType !== "All") {
      filtered = filtered.filter((p) => (p.reality_type || "AR") === selectedRealityType)
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredProjects(filtered)
  }, [projects, selectedCategory, selectedRealityType, searchTerm])

  return (
    <div className="space-y-8">
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="relative">
          <Input
            placeholder="Search projects..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-card/50 border-white/20"
          />
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground"
                  : "glass hover:bg-primary/20 hover:border-primary/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {realityTypes.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedRealityType(type)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition ${
                selectedRealityType === type
                  ? "bg-secondary text-secondary-foreground"
                  : "glass hover:bg-secondary/20 hover:border-secondary/50"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="glass rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <Card
              key={project.id}
              className="glass border-white/20 hover:border-primary/50 transition overflow-hidden group cursor-pointer"
              onClick={() => (window.location.href = `/projects/${project.id}`)}
            >
              <div className="relative h-56 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                {project.thumbnail_url ? (
                  <img
                    src={project.thumbnail_url || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-5xl">🎨</div>
                  </div>
                )}
                {project.featured && (
                  <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
                    Featured
                  </div>
                )}
                <div className="absolute top-3 left-3 bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-semibold">
                  {project.reality_type || "AR"}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <CardDescription className="text-xs">{project.category}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3">{project.description}</p>
                <button className="mt-4 w-full px-4 py-2 rounded-lg bg-primary/20 hover:bg-primary/30 text-primary font-medium transition text-sm">
                  View Details
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground mb-4">No projects found</p>
          <button
            onClick={() => {
              setSearchTerm("")
              setSelectedCategory("All")
              setSelectedRealityType("All")
            }}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredProjects.length} of {projects.length} projects
      </div>
    </div>
  )
}
