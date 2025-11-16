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
  coming_soon?: boolean
  screenshots?: Array<{ image_url: string }>
  created_at: string
}

export default function ProjectDetailPage() {
  const params = useParams()
  const id = params.id as string
  const [project, setProject] = useState<Project | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [fullscreenScreenshot, setFullscreenScreenshot] = useState<string | null>(null)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase.from("projects").select("*").eq("id", id).single()

        if (fetchError) {
          setError("Project not found")
          return
        }

        // Fetch screenshots if they exist
        const { data: screenshots } = await supabase
          .from("project_screenshots")
          .select("image_url")
          .eq("project_id", id)
          .order("order_index", { ascending: true })

        const projectData = {
          ...data,
          screenshots: screenshots || [],
        }

        setProject(projectData)
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
            <div className="flex items-center gap-3">
              <p className="text-lg text-muted-foreground">{project.category}</p>
              {project.coming_soon && (
                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-semibold">
                  Coming Soon
                </span>
              )}
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 flex-wrap items-center">
            <span className="text-sm text-muted-foreground">Share:</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/projects/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2] hover:bg-[#0A66C2]/80 text-white transition"
              title="Share on LinkedIn"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.475-2.236-1.986-2.236-1.081 0-1.722.731-2.004 1.438-.103.25-.129.599-.129.949v5.418h-3.554s.047-8.789 0-9.708h3.554v1.375c.427-.659 1.191-1.599 2.898-1.599 2.117 0 3.704 1.386 3.704 4.364v5.568zM5.337 8.855c-1.144 0-1.915-.759-1.915-1.707 0-.955.768-1.708 1.959-1.708 1.188 0 1.914.753 1.939 1.708 0 .948-.751 1.707-1.983 1.707zm1.581 11.597H3.771V9.044h3.147v11.408zM22.224 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.224 0z" />
              </svg>
              <span className="text-sm">LinkedIn</span>
            </a>
            <a
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(project.title)}&url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/projects/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#000000] hover:bg-[#000000]/80 text-white transition"
              title="Share on X"
            >
              <span>𝕏</span>
              <span className="text-sm">X</span>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${project.title} - ${typeof window !== "undefined" ? window.location.origin : ""}/projects/${id}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#25D366] hover:bg-[#25D366]/80 text-white transition"
              title="Share on WhatsApp"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.15-1.739-.86-2.01-.96-.27-.11-.459-.15-.655.15-.196.295-.759.959-.929 1.155-.168.195-.339.22-.636.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.655-1.58-.9-2.164-.236-.563-.474-.963-.973-.963-.5 0-1.079.075-1.643.075-.564 0-1.479.298-2.254.919-.774.62-2.956 2.889-2.956 7.046 0 4.158 3.03 8.155 3.422 8.82.393.665 5.85 8.948 14.207 12.564 1.987.738 3.532 1.181 4.743 1.518 1.987.626 3.793.537 5.221-.324 1.427-.861 4.587-1.876 5.245-3.688.658-1.811.131-3.295-.197-3.647-.328-.353-1.203-.565-2.5-.88z" />
              </svg>
              <span className="text-sm">WhatsApp</span>
            </a>
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

          {/* Screenshots */}
          {project.screenshots && project.screenshots.length > 0 && (
            <Card className="glass border-white/20 p-6">
              <h2 className="text-2xl font-bold mb-6">Screenshots</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {project.screenshots.map((screenshot: any, index: number) => (
                  <div 
                    key={index} 
                    className="relative w-full h-48 rounded-lg overflow-hidden cursor-pointer group"
                    onClick={() => setFullscreenScreenshot(screenshot.image_url)}
                  >
                    <img
                      src={screenshot.image_url}
                      alt={`Screenshot ${index + 1}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition duration-300 flex items-center justify-center">
                      <svg className="w-12 h-12 text-white opacity-0 group-hover:opacity-100 transition duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 13H9" />
                      </svg>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {/* Fullscreen Screenshot Modal */}
          {fullscreenScreenshot && (
            <div 
              className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
              onClick={() => setFullscreenScreenshot(null)}
            >
              <div className="relative max-w-4xl max-h-screen">
                <img
                  src={fullscreenScreenshot}
                  alt="Screenshot fullscreen"
                  className="w-full h-full object-contain"
                  onClick={(e) => e.stopPropagation()}
                />
                <button
                  onClick={() => setFullscreenScreenshot(null)}
                  className="absolute top-4 right-4 bg-white/20 hover:bg-white/40 text-white rounded-full p-2 transition"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Download Button */}
          {project.download_link && (
            <div className="flex gap-4">
              {project.coming_soon ? (
                <Button size="lg" disabled className="bg-primary/50 text-primary-foreground cursor-not-allowed">
                  Coming Soon - Download Available Later
                </Button>
              ) : (
                <a href={project.download_link} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Download
                  </Button>
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
