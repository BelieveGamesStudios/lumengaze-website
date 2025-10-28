"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt: string | null
  image_url: string | null
  created_at: string
  published: boolean
}

export function BlogGrid() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [filteredPosts, setFilteredPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const fetchPosts = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("published", true)
        .order("created_at", { ascending: false })

      setPosts(data || [])
      setLoading(false)
    }

    fetchPosts()
  }, [])

  useEffect(() => {
    let filtered = posts

    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.excerpt?.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    setFilteredPosts(filtered)
  }, [posts, searchTerm])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Search */}
      <div className="relative">
        <Input
          placeholder="Search blog posts..."
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

      {/* Blog posts grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-lg h-80 animate-pulse" />
          ))}
        </div>
      ) : filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/blog/${post.slug}`}>
              <Card className="glass border-white/20 hover:border-primary/50 transition overflow-hidden group cursor-pointer h-full flex flex-col">
                {post.image_url && (
                  <div className="relative h-48 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                    <img
                      src={post.image_url || "/placeholder.svg"}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-300"
                    />
                  </div>
                )}
                <div className="p-6 flex flex-col flex-1">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-primary transition">
                    {post.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4 flex-1">
                    {post.excerpt || "No excerpt available"}
                  </p>
                  <p className="text-xs text-muted-foreground">{formatDate(post.created_at)}</p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-lg text-muted-foreground mb-4">No blog posts found</p>
          <button
            onClick={() => setSearchTerm("")}
            className="px-6 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition font-medium"
          >
            Clear Search
          </button>
        </div>
      )}

      {/* Results count */}
      <div className="text-center text-sm text-muted-foreground">
        Showing {filteredPosts.length} of {posts.length} posts
      </div>
    </div>
  )
}
