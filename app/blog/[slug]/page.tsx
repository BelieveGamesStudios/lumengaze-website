"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { useParams } from "next/navigation"

interface BlogPost {
  id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  image_url: string | null
  created_at: string
  updated_at: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      const supabase = createClient()

      // Fetch the main post
      const { data: postData } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .single()

      if (postData) {
        setPost(postData)

        // Fetch related posts (limit to 3)
        const { data: related } = await supabase
          .from("blog_posts")
          .select("*")
          .eq("published", true)
          .neq("id", postData.id)
          .limit(3)

        setRelatedPosts(related || [])
      }

      setLoading(false)
    }

    fetchPost()
  }, [slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="glass rounded-lg h-96 animate-pulse" />
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="pt-24 pb-20">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-bold mb-4">Post not found</h1>
            <p className="text-muted-foreground mb-8">The blog post you're looking for doesn't exist.</p>
            <Link href="/blog" className="text-primary hover:underline">
              Back to Blog
            </Link>
          </div>
        </div>
        <Footer />
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back link */}
          <Link href="/blog" className="text-primary hover:underline text-sm mb-8 inline-block">
            ← Back to Blog
          </Link>

          {/* Post header */}
          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">{post.title}</h1>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span>{formatDate(post.created_at)}</span>
              <span>•</span>
              <span>5 min read</span>
            </div>
          </div>

          {/* Featured image */}
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gradient-to-br from-primary/20 to-secondary/20">
              <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Post content */}
          <Card className="glass border-white/20 p-8 mb-12">
            <div className="prose prose-invert max-w-none">
              <div className="text-foreground whitespace-pre-wrap leading-relaxed">{post.content}</div>
            </div>
          </Card>

          {/* Related posts */}
          {relatedPosts.length > 0 && (
            <div>
              <h2 className="text-3xl font-bold mb-8">Related Posts</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {relatedPosts.map((relatedPost) => (
                  <Link key={relatedPost.id} href={`/blog/${relatedPost.slug}`}>
                    <Card className="glass border-white/20 hover:border-primary/50 transition overflow-hidden cursor-pointer h-full">
                      {relatedPost.image_url && (
                        <div className="h-40 bg-gradient-to-br from-primary/20 to-secondary/20 overflow-hidden">
                          <img
                            src={relatedPost.image_url || "/placeholder.svg"}
                            alt={relatedPost.title}
                            className="w-full h-full object-cover hover:scale-110 transition duration-300"
                          />
                        </div>
                      )}
                      <div className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">{relatedPost.title}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-2">{relatedPost.excerpt}</p>
                        <p className="text-xs text-muted-foreground mt-3">{formatDate(relatedPost.created_at)}</p>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
