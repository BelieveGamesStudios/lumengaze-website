"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Project {
  id: string
  title: string
  description: string
  category: string
  featured: boolean
  thumbnail_url?: string
  video_link?: string
  download_link?: string
  reality_type?: string
  created_at: string
}

export default function ProjectsAdminPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    featured: false,
    thumbnail_url: "",
    video_link: "",
    download_link: "",
    reality_type: "AR",
  })
  const [screenshots, setScreenshots] = useState<string[]>([])

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("projects").select("*").order("created_at", { ascending: false })
    setProjects(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from("projects").update(formData).eq("id", editingId)
      if (!error) {
        if (screenshots.length > 0) {
          await supabase.from("project_screenshots").delete().eq("project_id", editingId)
          const screenshotData = screenshots.map((url, index) => ({
            project_id: editingId,
            image_url: url,
            order_index: index,
          }))
          await supabase.from("project_screenshots").insert(screenshotData)
        }
        setEditingId(null)
        setFormData({
          title: "",
          description: "",
          category: "",
          featured: false,
          thumbnail_url: "",
          video_link: "",
          download_link: "",
          reality_type: "AR",
        })
        setScreenshots([])
        setShowForm(false)
        fetchProjects()
      }
    } else {
      const { data: project, error } = await supabase.from("projects").insert([formData]).select().single()

      if (!error && project) {
        if (screenshots.length > 0) {
          const screenshotData = screenshots.map((url, index) => ({
            project_id: project.id,
            image_url: url,
            order_index: index,
          }))
          await supabase.from("project_screenshots").insert(screenshotData)
        }

        setFormData({
          title: "",
          description: "",
          category: "",
          featured: false,
          thumbnail_url: "",
          video_link: "",
          download_link: "",
          reality_type: "AR",
        })
        setScreenshots([])
        setShowForm(false)
        fetchProjects()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      const supabase = createClient()
      await supabase.from("projects").delete().eq("id", id)
      fetchProjects()
    }
  }

  const addScreenshot = () => {
    setScreenshots([...screenshots, ""])
  }

  const updateScreenshot = (index: number, value: string) => {
    const newScreenshots = [...screenshots]
    newScreenshots[index] = value
    setScreenshots(newScreenshots)
  }

  const removeScreenshot = (index: number) => {
    setScreenshots(screenshots.filter((_, i) => i !== index))
  }

  const handleEdit = (project: Project) => {
    setFormData({
      title: project.title,
      description: project.description,
      category: project.category,
      featured: project.featured,
      thumbnail_url: project.thumbnail_url || "",
      video_link: project.video_link || "",
      download_link: project.download_link || "",
      reality_type: project.reality_type || "AR",
    })

    const fetchScreenshots = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("project_screenshots")
        .select("image_url")
        .eq("project_id", project.id)
        .order("order_index", { ascending: true })
      if (data) {
        setScreenshots(data.map((s) => s.image_url))
      }
    }
    fetchScreenshots()

    setEditingId(project.id)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Projects</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({
                title: "",
                description: "",
                category: "",
                featured: false,
                thumbnail_url: "",
                video_link: "",
                download_link: "",
                reality_type: "AR",
              })
            }
          }}
        >
          {showForm ? "Cancel" : "Add Project"}
        </Button>
      </div>

      {showForm && (
        <Card className="glass border-white/20 mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Project title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Project description"
                className="w-full px-3 py-2 rounded-lg bg-card/50 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                rows={4}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <Input
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., AR Experience"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Reality Type</label>
              <select
                value={formData.reality_type}
                onChange={(e) => setFormData({ ...formData, reality_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-card/50 border border-white/20 text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="AR">AR (Augmented Reality)</option>
                <option value="VR">VR (Virtual Reality)</option>
                <option value="MR">MR (Mixed Reality)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Project Thumbnail (Image URL)</label>
              <Input
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://example.com/thumbnail.jpg"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Video Link (YouTube or Vimeo)</label>
              <Input
                value={formData.video_link}
                onChange={(e) => setFormData({ ...formData, video_link: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Download Link</label>
              <Input
                value={formData.download_link}
                onChange={(e) => setFormData({ ...formData, download_link: e.target.value })}
                placeholder="https://example.com/download"
                type="url"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Screenshots (Image URLs)</label>
              <div className="space-y-2">
                {screenshots.map((screenshot, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={screenshot}
                      onChange={(e) => updateScreenshot(index, e.target.value)}
                      placeholder={`Screenshot ${index + 1} URL`}
                      type="url"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeScreenshot(index)}
                      className="bg-transparent text-red-500 hover:text-red-600"
                    >
                      Remove
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addScreenshot} className="bg-transparent">
                  Add Screenshot
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="featured"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="featured" className="text-sm">
                Featured
              </label>
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update Project" : "Create Project"}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Card key={project.id} className="glass border-white/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{project.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{project.category}</p>
                    <p className="text-xs text-primary mt-1">{project.reality_type || "AR"}</p>
                  </div>
                  {project.featured && (
                    <span className="text-xs bg-accent text-accent-foreground px-2 py-1 rounded">Featured</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{project.description}</p>
                <div className="space-y-2 mb-4 text-sm">
                  {project.thumbnail_url && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Thumbnail:</span> {project.thumbnail_url}
                    </p>
                  )}
                  {project.video_link && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Video:</span> {project.video_link}
                    </p>
                  )}
                  {project.download_link && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Download:</span> {project.download_link}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleEdit(project)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(project.id)}
                  >
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
