"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

interface Project {
  id: string
  title: string
  description: string
  category: string
  image_url: string | null
  thumbnail_url: string | null
  featured: boolean
}

export function ProjectsPreview() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [categories, setCategories] = useState<string[]>(["All"])
  const [selectedCategory, setSelectedCategory] = useState("All")

  useEffect(() => {
    const fetchProjects = async () => {
      const supabase = createClient()

      const { data: allProjects } = await supabase.from("projects").select("category")

      const uniqueCategories = ["All", ...new Set(allProjects?.map((p) => p.category).filter(Boolean) || [])]
      setCategories(uniqueCategories as string[])

      const { data } = await supabase.from("projects").select("*").eq("featured", true).limit(6)

      setProjects(data || [])
      setLoading(false)
    }

    fetchProjects()
  }, [])

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((p) => p.category === selectedCategory)

  return (
    <section id="projects" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">Featured Projects</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Explore our collection of cutting-edge XR experiences and innovations
        </p>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 justify-center mb-12">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              cat === selectedCategory ? "bg-primary text-primary-foreground" : "glass hover:bg-primary/20"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <Link key={project.id} href={`/projects/${project.id}`}>
                <Card className="glass border-white/20 hover:border-primary/50 transition overflow-hidden group cursor-pointer hover:shadow-lg hover:shadow-primary/50">
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                    {project.thumbnail_url ? (
                      <img
                        src={project.thumbnail_url || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="text-4xl">🎨</div>
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <CardDescription className="text-xs mt-1">{project.category}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </CardContent>
                </Card>
              </Link>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No projects in this category yet.</p>
            </div>
          )}
        </div>
      )}

      <div className="text-center mt-12">
        <Link href="/projects">
          <button className="px-8 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium">
            View All Projects
          </button>
        </Link>
      </div>
    </section>
  )
}
