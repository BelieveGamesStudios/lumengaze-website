"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card } from "@/components/ui/card"

interface PrivacyPolicy {
  id: string
  content: string
  version: number
  updated_at: string
}

export default function PrivacyPage() {
  const [policy, setPolicy] = useState<PrivacyPolicy | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        const supabase = createClient()
        const { data, error: fetchError } = await supabase
          .from("privacy_policies")
          .select("*")
          .order("version", { ascending: false })
          .limit(1)
          .single()

        if (fetchError && fetchError.code !== "PGRST116") {
          throw fetchError
        }

        setPolicy(data || null)
      } catch (err: any) {
        setError(err?.message || "Failed to load privacy policy")
      } finally {
        setLoading(false)
      }
    }

    fetchPolicy()
  }, [])

  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 gradient-text">Privacy Policy</h1>
            <p className="text-lg text-muted-foreground">
              Your privacy is important to us. Please read our privacy policy carefully.
            </p>
          </div>

          {loading && (
            <Card className="glass border-white/20 p-8">
              <p className="text-muted-foreground">Loading privacy policy...</p>
            </Card>
          )}

          {error && (
            <Card className="glass border-white/20 p-8 bg-red-500/10 border-red-500/20">
              <p className="text-red-400">{error}</p>
            </Card>
          )}

          {!loading && policy && (
            <Card className="glass border-white/20 p-8">
              <div
                className="prose prose-invert max-w-none text-muted-foreground"
                dangerouslySetInnerHTML={{ __html: policy.content }}
              />
              <div className="mt-8 pt-6 border-t border-white/10 text-sm text-muted-foreground">
                <p>Last updated: {new Date(policy.updated_at).toLocaleDateString()}</p>
                <p>Version: {policy.version}</p>
              </div>
            </Card>
          )}

          {!loading && !policy && (
            <Card className="glass border-white/20 p-8">
              <p className="text-muted-foreground">No privacy policy has been set yet.</p>
            </Card>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}
