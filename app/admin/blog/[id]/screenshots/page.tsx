"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface Screenshot {
  url: string
  alt?: string
}

interface BlogPost {
  id: string
  title: string
  screenshots?: Screenshot[] | string[]
}

export default function BlogScreenshotsPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [screenshots, setScreenshots] = useState<Screenshot[]>([])
  const [newScreenshot, setNewScreenshot] = useState({ url: "", alt: "" })
  const [uploading, setUploading] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [editingScreenshot, setEditingScreenshot] = useState({ url: "", alt: "" })

  useEffect(() => {
    fetchPost()
  }, [id])

  const fetchPost = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single()

    if (data) {
      setPost(data)
      // Normalize screenshots to object format
      const normalized = normalizeScreenshots(data.screenshots || [])
      setScreenshots(normalized)
    }
    setLoading(false)
  }

  // Convert both string and object formats to object format
  const normalizeScreenshots = (screenshots: (string | Screenshot)[]): Screenshot[] => {
    return screenshots.map((s) => (typeof s === "string" ? { url: s } : s))
  }

  const handleAddScreenshot = async () => {
    if (!newScreenshot.url.trim()) {
      alert("Please enter a screenshot URL")
      return
    }

    setUploading(true)
    const updatedScreenshots = [...screenshots, { url: newScreenshot.url.trim(), alt: newScreenshot.alt.trim() || undefined }]
    
    const supabase = createClient()
    const { error } = await supabase.from("blog_posts").update({ screenshots: updatedScreenshots }).eq("id", id)

    if (!error) {
      setScreenshots(updatedScreenshots)
      setNewScreenshot({ url: "", alt: "" })
      alert("Screenshot added successfully!")
    } else {
      alert("Failed to add screenshot: " + error.message)
    }
    setUploading(false)
  }

  const handleRemoveScreenshot = async (index: number) => {
    if (!confirm("Remove this screenshot?")) return

    const updatedScreenshots = screenshots.filter((_, i) => i !== index)
    
    const supabase = createClient()
    const { error } = await supabase.from("blog_posts").update({ screenshots: updatedScreenshots }).eq("id", id)

    if (!error) {
      setScreenshots(updatedScreenshots)
      alert("Screenshot removed successfully!")
    } else {
      alert("Failed to remove screenshot: " + error.message)
    }
  }

  const handleStartEdit = (index: number) => {
    setEditingIndex(index)
    setEditingScreenshot({ 
      url: screenshots[index].url, 
      alt: screenshots[index].alt || "" 
    })
  }

  const handleSaveEdit = async () => {
    if (editingIndex === null) return
    if (!editingScreenshot.url.trim()) {
      alert("Please enter a screenshot URL")
      return
    }

    const updatedScreenshots = [...screenshots]
    updatedScreenshots[editingIndex] = {
      url: editingScreenshot.url.trim(),
      alt: editingScreenshot.alt.trim() || undefined,
    }

    setUploading(true)
    const supabase = createClient()
    const { error } = await supabase.from("blog_posts").update({ screenshots: updatedScreenshots }).eq("id", id)

    if (!error) {
      setScreenshots(updatedScreenshots)
      setEditingIndex(null)
      setEditingScreenshot({ url: "", alt: "" })
      alert("Screenshot updated successfully!")
    } else {
      alert("Failed to update screenshot: " + error.message)
    }
    setUploading(false)
  }

  const handleCancelEdit = () => {
    setEditingIndex(null)
    setEditingScreenshot({ url: "", alt: "" })
  }

  const moveScreenshot = async (fromIndex: number, toIndex: number) => {
    const updated = [...screenshots]
    const [removed] = updated.splice(fromIndex, 1)
    updated.splice(toIndex, 0, removed)

    const supabase = createClient()
    const { error } = await supabase.from("blog_posts").update({ screenshots: updated }).eq("id", id)

    if (!error) {
      setScreenshots(updated)
      alert("Screenshot order updated!")
    } else {
      alert("Failed to update order: " + error.message)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
        <Link href="/admin/blog">
          <Button>Back to Blog</Button>
        </Link>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <Link href="/admin/blog" className="text-primary hover:underline text-sm mb-4 inline-block">
          ← Back to Blog Posts
        </Link>
        <h1 className="text-4xl font-bold gradient-text">Screenshots: {post.title}</h1>
        <p className="text-muted-foreground mt-2">Manage screenshots for this blog post</p>
      </div>

      {/* Add New Screenshot Form */}
      <Card className="glass border-white/20 mb-8 p-6">
        <h2 className="text-2xl font-bold mb-4">Add New Screenshot</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Screenshot URL *</label>
            <Input
              value={newScreenshot.url}
              onChange={(e) => setNewScreenshot({ ...newScreenshot, url: e.target.value })}
              placeholder="https://example.com/screenshot.png"
              type="url"
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Upload images to Supabase Storage and paste the public URL here
            </p>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Alt Text (Optional)</label>
            <Input
              value={newScreenshot.alt}
              onChange={(e) => setNewScreenshot({ ...newScreenshot, alt: e.target.value })}
              placeholder="e.g., Dashboard overview"
              disabled={uploading}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Helps with accessibility and SEO
            </p>
          </div>
          <Button onClick={handleAddScreenshot} disabled={uploading} className="w-full">
            {uploading ? "Adding..." : "Add Screenshot"}
          </Button>
        </div>
      </Card>

      {/* Current Screenshots */}
      <div>
        <h2 className="text-2xl font-bold mb-4">
          Screenshots ({screenshots.length})
        </h2>

        {screenshots.length === 0 ? (
          <Card className="glass border-white/20 p-6 text-center">
            <p className="text-muted-foreground">No screenshots added yet. Add one above to get started!</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {screenshots.map((screenshot, index) => (
              <Card key={index} className="glass border-white/20 p-6">
                {editingIndex === index ? (
                  // Edit mode
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Screenshot URL *</label>
                      <Input
                        value={editingScreenshot.url}
                        onChange={(e) => setEditingScreenshot({ ...editingScreenshot, url: e.target.value })}
                        placeholder="https://example.com/screenshot.png"
                        type="url"
                        disabled={uploading}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Alt Text (Optional)</label>
                      <Input
                        value={editingScreenshot.alt || ""}
                        onChange={(e) => setEditingScreenshot({ ...editingScreenshot, alt: e.target.value })}
                        placeholder="e.g., Dashboard overview"
                        disabled={uploading}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSaveEdit} disabled={uploading} className="flex-1">
                        {uploading ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button onClick={handleCancelEdit} variant="outline" className="flex-1 bg-transparent">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  // View mode
                  <div>
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <p className="text-sm font-medium text-muted-foreground mb-1">
                            Screenshot {index + 1}
                          </p>
                          <a
                            href={screenshot.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline break-all text-sm"
                          >
                            {screenshot.url}
                          </a>
                        </div>
                      </div>
                      {screenshot.alt && (
                        <p className="text-sm text-muted-foreground">
                          <strong>Alt text:</strong> {screenshot.alt}
                        </p>
                      )}
                    </div>

                    {/* Thumbnail preview */}
                    <div className="mb-4 rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 h-32">
                      <img
                        src={screenshot.url}
                        alt={screenshot.alt || `Screenshot ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.src = "/placeholder.svg"
                        }}
                      />
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleStartEdit(index)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="bg-transparent"
                        onClick={() => handleRemoveScreenshot(index)}
                      >
                        Remove
                      </Button>
                      {index > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => moveScreenshot(index, index - 1)}
                        >
                          ↑ Move Up
                        </Button>
                      )}
                      {index < screenshots.length - 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => moveScreenshot(index, index + 1)}
                        >
                          Move Down ↓
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Help section */}
      <Card className="glass border-white/20 p-6 mt-8">
        <h3 className="text-lg font-bold mb-3">How to add screenshots</h3>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>
            <strong>Upload image to Supabase Storage:</strong> Go to Supabase Dashboard → Storage → Create a bucket
            (e.g., "blog-screenshots") → Upload your image
          </li>
          <li>
            <strong>Get the public URL:</strong> Click on the uploaded file → Copy the "Public URL"
          </li>
          <li>
            <strong>Paste the URL:</strong> Paste it in the "Screenshot URL" field above
          </li>
          <li>
            <strong>Add optional alt text:</strong> Describe the screenshot for accessibility
          </li>
          <li>
            <strong>Reorder if needed:</strong> Use "Move Up" and "Move Down" buttons to arrange screenshots
          </li>
        </ol>
      </Card>
    </div>
  )
}
