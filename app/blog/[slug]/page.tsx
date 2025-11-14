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
  screenshots?: string[] | { url: string; alt?: string }[]
  created_at: string
  updated_at: string
}

export default function BlogDetailPage() {
  const params = useParams()
  const slug = params.slug as string
  const [post, setPost] = useState<BlogPost | null>(null)
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [currentScreenshotIndex, setCurrentScreenshotIndex] = useState(0)

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

  // Helper to extract screenshot URL (handles both string and object formats)
  const getScreenshotUrl = (screenshot: string | { url: string; alt?: string }) => {
    return typeof screenshot === "string" ? screenshot : screenshot.url
  }

  const getScreenshotAlt = (index: number, screenshot: string | { url: string; alt?: string }) => {
    if (typeof screenshot === "object" && screenshot.alt) {
      return screenshot.alt
    }
    return `${post?.title} screenshot ${index + 1}`
  }

  // Get current screenshot
  const screenshots = post?.screenshots || []
  const currentScreenshot = screenshots.length > 0 ? screenshots[currentScreenshotIndex] : null
  const currentScreenshotUrl = currentScreenshot ? getScreenshotUrl(currentScreenshot) : null

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

          {/* Share buttons */}
          <div className="mb-8 flex gap-3 flex-wrap items-center">
            <span className="text-sm text-muted-foreground">Share:</span>
            <a
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.slug}`)}`}
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
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(`${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.slug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#000000] hover:bg-[#000000]/80 text-white transition"
              title="Share on X"
            >
              <span>𝕏</span>
              <span className="text-sm">X</span>
            </a>
            <a
              href={`https://wa.me/?text=${encodeURIComponent(`${post.title} - ${typeof window !== "undefined" ? window.location.origin : ""}/blog/${post.slug}`)}`}
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

          {/* Featured image */}
          {post.image_url && (
            <div className="mb-8 rounded-lg overflow-hidden h-96 bg-gradient-to-br from-primary/20 to-secondary/20">
              <img src={post.image_url || "/placeholder.svg"} alt={post.title} className="w-full h-full object-cover" />
            </div>
          )}

          {/* Post content */}
          <Card className="glass border-white/20 p-8 mb-12">
            <div className="prose prose-invert max-w-none">
              <div
                className="text-foreground leading-relaxed prose-invert"
                dangerouslySetInnerHTML={{ __html: post.content }}
              />
            </div>
          </Card>

          {/* Screenshots Gallery */}
          {screenshots.length > 0 && (
            <div className="mb-12">
              <h2 className="text-3xl font-bold mb-6">Screenshots</h2>
              <div className="space-y-4">
                {/* Main screenshot */}
                <div className="rounded-lg overflow-hidden bg-gradient-to-br from-primary/20 to-secondary/20 h-96">
                  {currentScreenshotUrl && (
                    <img
                      src={currentScreenshotUrl}
                      alt={getScreenshotAlt(currentScreenshotIndex, currentScreenshot!)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>

                {/* Screenshot thumbnails and navigation */}
                {screenshots.length > 1 && (
                  <div className="space-y-4">
                    {/* Thumbnail grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                      {screenshots.map((screenshot, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentScreenshotIndex(index)}
                          className={`relative rounded-lg overflow-hidden h-20 transition-all border-2 ${
                            currentScreenshotIndex === index
                              ? "border-primary ring-2 ring-primary/50"
                              : "border-white/10 hover:border-white/30"
                          }`}
                        >
                          <img
                            src={getScreenshotUrl(screenshot)}
                            alt={getScreenshotAlt(index, screenshot)}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>

                    {/* Navigation info */}
                    <div className="flex items-center justify-between text-sm text-muted-foreground px-2">
                      <span>
                        {currentScreenshotIndex + 1} / {screenshots.length}
                      </span>
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            setCurrentScreenshotIndex((prev) => (prev === 0 ? screenshots.length - 1 : prev - 1))
                          }
                          className="px-3 py-1 rounded border border-white/20 hover:border-primary/50 transition"
                        >
                          ← Previous
                        </button>
                        <button
                          onClick={() =>
                            setCurrentScreenshotIndex((prev) => (prev === screenshots.length - 1 ? 0 : prev + 1))
                          }
                          className="px-3 py-1 rounded border border-white/20 hover:border-primary/50 transition"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

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
