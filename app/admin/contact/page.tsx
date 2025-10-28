"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface ContactSubmission {
  id: string
  name: string
  email: string
  message: string
  created_at: string
}

export default function ContactAdminPage() {
  const [submissions, setSubmissions] = useState<ContactSubmission[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchSubmissions = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("contact_submissions").select("*").order("created_at", { ascending: false })

      setSubmissions(data || [])
      setLoading(false)
    }

    fetchSubmissions()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div>
      <h1 className="text-4xl font-bold mb-8 gradient-text">Contact Submissions</h1>

      {loading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      ) : submissions.length > 0 ? (
        <div className="space-y-4">
          {submissions.map((submission) => (
            <Card key={submission.id} className="glass border-white/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{submission.name}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{submission.email}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">{formatDate(submission.created_at)}</p>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{submission.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No contact submissions yet</p>
        </div>
      )}
    </div>
  )
}
