"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import dynamic from "next/dynamic"
import "react-quill/dist/quill.snow.css"

// ReactQuill is a client-only rich text editor that preserves pasted Word formatting
const ReactQuill = dynamic(() => import("react-quill"), { ssr: false })

// Polyfill ReactDOM.findDOMNode for environments where it's missing (some React builds
// used by Next/Turbopack may not expose findDOMNode). ReactQuill relies on it.
if (typeof window !== "undefined") {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ReactDOM = require("react-dom")
    // @ts-ignore - add polyfill at runtime only if missing
    if (ReactDOM && !ReactDOM.findDOMNode) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      ReactDOM.findDOMNode = (instance: any) => {
        if (!instance) return null
        // ReactQuill may expose editor or getEditor
        if (instance.editor && instance.editor.root) return instance.editor.root
        if (typeof instance.getEditor === "function") {
          const ed = instance.getEditor()
          return ed?.root || null
        }
        // If it's a DOM node, return it
        if (instance instanceof HTMLElement) return instance
        return null
      }
    }
  } catch (e) {
    // ignore — polyfill best-effort
  }
}

const quillModules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link", "image"],
    ["clean"],
  ],
  clipboard: {
    // By default Quill attempts to sanitize/normalize pasted content.
    // matchVisual false keeps more of the original Word formatting where possible.
    matchVisual: false,
  },
}

const quillFormats = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "list",
  "bullet",
  "link",
  "image",
]

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  content: string
  image_url: string | null
  published: boolean
  created_at: string
}

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    image_url: "",
    published: false,
  })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false })
    setPosts(data || [])
    setLoading(false)
  }

  // Slugify helper: lowercase, replace non-alphanumeric with dashes, collapse and trim
  const slugify = (value: string) => {
    return value
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
  }

  const handleEdit = (post: BlogPost) => {
    setEditingId(post.id)
    setFormData({
      title: post.title,
      // always regenerate slug from title for consistency
      slug: slugify(post.title),
      content: post.content,
      excerpt: post.excerpt || "",
      image_url: post.image_url || "",
      published: post.published,
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    // Ensure slug is unique before inserting/updating
    const ensureUniqueSlug = async (base: string, excludeId?: string | null) => {
      let candidate = base
      let i = 1
      while (true) {
        const { data } = await supabase.from("blog_posts").select("id").eq("slug", candidate)
        const exists = (data || []).length > 0
        if (!exists) return candidate
        // if updating, allow same id
        if (excludeId) {
          const conflict = (data || []).some((r: any) => r.id !== excludeId)
          if (!conflict) return candidate
        }
        candidate = `${base}-${i++}`
      }
    }

    const baseSlug = slugify(formData.title)
    const uniqueSlug = await ensureUniqueSlug(baseSlug, editingId)

    if (editingId) {
      const payload = { ...formData, slug: uniqueSlug }
      const { error } = await supabase.from("blog_posts").update(payload).eq("id", editingId)
      if (!error) {
        setEditingId(null)
        setFormData({ title: "", slug: "", content: "", excerpt: "", image_url: "", published: false })
        setShowForm(false)
        fetchPosts()
      }
    } else {
      const payload = { ...formData, slug: uniqueSlug }
      const { error } = await supabase.from("blog_posts").insert([payload])
      if (!error) {
        setFormData({ title: "", slug: "", content: "", excerpt: "", image_url: "", published: false })
        setShowForm(false)
        fetchPosts()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      const supabase = createClient()
      await supabase.from("blog_posts").delete().eq("id", id)
      fetchPosts()
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ title: "", slug: "", content: "", excerpt: "", image_url: "", published: false })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Blog Posts</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "New Post"}</Button>
      </div>

      {showForm && (
        <Card className="glass border-white/20 mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value, slug: slugify(e.target.value) })
                }
                placeholder="Post title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Slug</label>
              <Input
                value={formData.slug}
                // slug is autogenerated from title; make read-only to enforce that behavior
                readOnly
                placeholder="autogenerated-from-title"
                required
              />
              <p className="text-xs text-muted-foreground mt-1">Slug is autogenerated from title and kept unique on save.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Excerpt</label>
              <Input
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                placeholder="Brief summary"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Featured Image URL</label>
              <Input
                value={formData.image_url}
                onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                placeholder="https://example.com/image.jpg"
                type="url"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Content</label>
              {/* Rich text editor preserves formatting when pasting from Word */}
              <div className="prose prose-invert bg-card/50 p-2 rounded-lg border border-white/20">
                {/* ReactQuill is dynamically imported; when not available this area will be empty */}
                {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
                {/* @ts-ignore */}
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={(content: string) => setFormData({ ...formData, content })}
                  modules={quillModules}
                  formats={quillFormats}
                />
              </div>
              <p className="text-xs text-muted-foreground mt-2">Paste from Word and formatting (bold, lists, links) will be preserved.</p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="published"
                checked={formData.published}
                onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                className="rounded"
              />
              <label htmlFor="published" className="text-sm">
                Publish
              </label>
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Post" : "Create Post"}
              </Button>
              <Button type="button" variant="outline" onClick={handleCancel} className="flex-1 bg-transparent">
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id} className="glass border-white/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{post.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">/{post.slug}</p>
                  </div>
                  {post.published && (
                    <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">Published</span>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{post.excerpt}</p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleEdit(post)}>
                    Edit
                  </Button>
                    <Button variant="outline" size="sm" className="bg-transparent" onClick={() => {
                      window.location.href = `/admin/blog/${post.id}/screenshots`
                    }}>
                      Screenshots
                    </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(post.id)}
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
