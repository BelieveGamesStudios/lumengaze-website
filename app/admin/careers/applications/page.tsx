"use client"

import React, { useEffect, useState } from "react"
import Link from "next/link"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface ApplicationRecord {
  id: string
  career_id: string | null
  full_name: string
  email: string
  role: string
  phone?: string | null
  cv_url?: string | null
  notes?: string | null
  created_at: string
  careers?: { title?: string } | null
}

export default function ApplicationsAdminPage() {
  const [applications, setApplications] = useState<ApplicationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const supabase = createClient()
      const { data, error: fetchError } = await supabase
        .from("career_applications")
        .select(
          `
          id,
          career_id,
          full_name,
          email,
          role,
          phone,
          cv_url,
          notes,
          created_at,
          careers:career_id (
            title
          )
        `
        )
        .order("created_at", { ascending: false })

      if (fetchError) {
        setError(fetchError.message)
      } else {
        // Flatten career title into each record for easier rendering
        const normalized = (data || []).map((r: any) => ({ ...r, career_title: r?.careers?.title || "" }))
        setApplications(normalized)
      }
    } catch (err: any) {
      setError(err?.message || String(err))
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this application? This action cannot be undone.")) return
    const supabase = createClient()
    await supabase.from("career_applications").delete().eq("id", id)
    fetchApplications()
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Job Applications</h1>
        <div className="flex gap-2">
          <Button onClick={() => fetchApplications()}>Refresh</Button>
          <Button variant="outline" asChild>
            <Link href="/admin/careers">Back to Positions</Link>
          </Button>
        </div>
      </div>

      <Card className="glass border-white/20">
        <CardHeader>
          <CardTitle>Submissions</CardTitle>
        </CardHeader>
        <CardContent>
          {loading && <p>Loading...</p>}
          {error && <p className="text-destructive">Error: {error}</p>}
          {!loading && applications.length === 0 && <p>No applications yet.</p>}

          {!loading && applications.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full table-auto border-collapse">
                <thead>
                  <tr className="text-left text-sm text-muted-foreground">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Phone</th>
                    <th className="py-2 pr-4">CV</th>
                    <th className="py-2 pr-4">Notes</th>
                    <th className="py-2 pr-4">Submitted</th>
                    <th className="py-2 pr-4">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((a: any) => (
                    <tr key={a.id} className="align-top border-t border-white/6">
                      <td className="py-3 pr-4">
                        <div className="font-medium">{a.full_name}</div>
                        <div className="text-xs text-muted-foreground">{a.career_title || "—"}</div>
                      </td>
                      <td className="py-3 pr-4">
                        <a href={`mailto:${a.email}`} className="text-primary hover:underline text-sm">
                          {a.email}
                        </a>
                      </td>
                      <td className="py-3 pr-4">{a.role}</td>
                      <td className="py-3 pr-4">{a.phone || "—"}</td>
                      <td className="py-3 pr-4">
                        {a.cv_url ? (
                          <a href={a.cv_url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            View CV
                          </a>
                        ) : (
                          <span className="text-muted-foreground">No CV</span>
                        )}
                      </td>
                      <td className="py-3 pr-4 max-w-xs truncate">{a.notes || "—"}</td>
                      <td className="py-3 pr-4 text-xs text-muted-foreground">{new Date(a.created_at).toLocaleString()}</td>
                      <td className="py-3 pr-4">
                        <div className="flex gap-2">
                          <Button size="sm" variant="secondary" asChild>
                            <a href={a.cv_url || "#"} target="_blank" rel="noreferrer">Open CV</a>
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDelete(a.id)}>
                            Delete
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
