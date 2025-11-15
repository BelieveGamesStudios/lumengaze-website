"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface Project {
  id: string
  title: string
  description: string
  category: string
  image_url: string
  thumbnail_url?: string
  video_link?: string
  download_link?: string
  created_at: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase.from("projects").select("*").eq("id", id).single()

        if (fetchError) {
          setError("Project not found")
          return
        }

        setProject(data)
      } catch (err) {
        setError("Failed to load project")
      } finally {
        setLoading(false)
      }
    }

    fetchProject()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-2xl font-bold">{error || "Project not found"}</h1>
        <Link href="/projects">
          <Button>Back to Projects</Button>
        </Link>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/projects" className="text-primary hover:underline mb-6 inline-block">
          ← Back to Projects
        </Link>

        <div className="space-y-8">
          {/* Hero Image */}
          {(project.thumbnail_url || project.image_url) && (
            <div className="relative w-full h-96 rounded-lg overflow-hidden">
              <img
                src={project.thumbnail_url || project.image_url}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Title and Category */}
          <div>
            <h1 className="text-4xl font-bold gradient-text mb-2">{project.title}</h1>
            <p className="text-lg text-muted-foreground">{project.category}</p>
          </div>

          {/* Description */}
          <Card className="glass border-white/20 p-6">
            <h2 className="text-2xl font-bold mb-4">About</h2>
            <div 
              className="text-foreground prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: project.description }}
            />
          </Card>

          {/* Video */}
          {project.video_link && (
            <Card className="glass border-white/20 p-6">
              <h2 className="text-2xl font-bold mb-4">Video</h2>
              <div className="aspect-video rounded-lg overflow-hidden">
                <iframe
                  width="100%"
                  height="100%"
                  src={project.video_link.replace("watch?v=", "embed/")}
                  title={project.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </Card>
          )}

          {/* Download Button */}
          {project.download_link && (
            <div className="flex gap-4">
              <a href={project.download_link} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Download
                </Button>
              </a>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
