"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface Career {
  id: string
  title: string
  department: string
  location: string
  description: string
  requirements: string
  salary_range?: string
  employment_type: string
  created_at: string
}

export function CareersGrid() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCareer, setSelectedCareer] = useState<Career | null>(null)
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [notes, setNotes] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [submitError, setSubmitError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCareers = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("careers").select("*").order("created_at", { ascending: false })
      setCareers(data || [])
      setLoading(false)
    }

    fetchCareers()
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="glass rounded-lg h-64 animate-pulse" />
        ))}
      </div>
    )
  }

  if (careers.length === 0) {
    return (
      <div className="text-center py-20">
        <p className="text-lg text-muted-foreground">No open positions at the moment. Check back soon!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {careers.map((career) => (
          <Card
            key={career.id}
            className="glass border-white/20 hover:border-primary/50 transition cursor-pointer group"
            onClick={() => setSelectedCareer(career)}
          >
            <CardHeader>
              <CardTitle className="text-lg group-hover:text-primary transition">{career.title}</CardTitle>
              <CardDescription className="text-xs">{career.department}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>📍</span>
                <span>{career.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>💼</span>
                <span>{career.employment_type}</span>
              </div>
              {career.salary_range && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>💰</span>
                  <span>{career.salary_range}</span>
                </div>
              )}
              <p className="text-sm text-muted-foreground line-clamp-2">
                {career.description
                  ?.replace(/<[^>]*>/g, "") // Strip HTML tags
                  .replace(/&nbsp;/g, " ") // Replace HTML entities
                  .replace(/&amp;/g, "&")
                  .replace(/&lt;/g, "<")
                  .replace(/&gt;/g, ">")
                  .replace(/&quot;/g, '"')
                  .substring(0, 150)}
              </p>
              <Button
                className="w-full mt-4"
                onClick={(e) => {
                  e.stopPropagation()
                  setSelectedCareer(career)
                }}
              >
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {selectedCareer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="glass border-white/20 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader className="sticky top-0 bg-background/80 backdrop-blur-md border-b border-white/10">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="text-2xl">{selectedCareer.title}</CardTitle>
                  <CardDescription className="text-sm mt-2">{selectedCareer.department}</CardDescription>
                </div>
                <button onClick={() => setSelectedCareer(null)} className="text-2xl hover:text-primary transition">
                  ✕
                </button>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Location</p>
                  <p className="font-medium">{selectedCareer.location}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Employment Type</p>
                  <p className="font-medium">{selectedCareer.employment_type}</p>
                </div>
                {selectedCareer.salary_range && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Salary Range</p>
                    <p className="font-medium">{selectedCareer.salary_range}</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">About This Role</h3>
                <div
                  className="text-muted-foreground prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedCareer.description }}
                />
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <div
                  className="text-muted-foreground prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedCareer.requirements }}
                />
              </div>

              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  if (!selectedCareer) return
                  setSubmitError(null)
                  setSubmitSuccess(null)

                  if (!fullName.trim()) {
                    setSubmitError("Please enter your full name.")
                    return
                  }
                  if (!phone.trim()) {
                    setSubmitError("Please enter your phone number.")
                    return
                  }
                  if (!cvFile) {
                    setSubmitError("Please upload your CV.")
                    return
                  }

                  setSubmitting(true)
                  try {
                    const supabase = createClient()

                    // Upload CV to storage bucket 'applications'
                    const filePath = `careers/${selectedCareer.id}/${Date.now()}_${cvFile.name}`
                    const { error: uploadError } = await supabase.storage.from("applications").upload(filePath, cvFile)

                    if (uploadError) {
                      setSubmitError("Failed to upload CV. Ensure the 'applications' storage bucket exists and is writable.")
                      setSubmitting(false)
                      return
                    }

                    // Get public URL (may require the bucket to be public or use signed URL)
                    const { data: publicData } = await supabase.storage.from("applications").getPublicUrl(filePath)
                    // @ts-ignore
                    const cvUrl = publicData?.publicUrl || ""

                    // Insert application record into `career_applications` table
                    const { error: insertError } = await supabase.from("career_applications").insert([
                      {
                        career_id: selectedCareer.id,
                        full_name: fullName,
                        role: selectedCareer.title,
                        phone,
                        cv_url: cvUrl,
                        notes,
                      },
                    ])

                    if (insertError) {
                      setSubmitError("Failed to save application. Ensure the `career_applications` table exists.")
                      setSubmitting(false)
                      return
                    }

                    setSubmitSuccess("Application submitted — thank you! We'll be in touch.")
                    setFullName("")
                    setPhone("")
                    setCvFile(null)
                    setNotes("")
                  } catch (err) {
                    // Generic fallback
                    setSubmitError("An unexpected error occurred while submitting your application.")
                  } finally {
                    setSubmitting(false)
                  }
                }}
              >
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full name</label>
                    <input
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-card/50 border border-white/10 text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Role Applying For</label>
                    <input value={selectedCareer.title} readOnly className="w-full px-3 py-2 rounded bg-card/30 border border-white/10 text-foreground" />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Phone number</label>
                    <input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-card/50 border border-white/10 text-foreground"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Upload CV</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => setCvFile(e.target.files ? e.target.files[0] : null)}
                      className="w-full px-3 py-2 rounded bg-card/50 border border-white/20 text-foreground"
                      required
                    />
                    {cvFile && (
                      <p className="text-sm text-muted-foreground mt-2">Selected file: {cvFile.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">Other notes</label>
                    <textarea
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 rounded bg-card/50 border border-white/10 text-foreground"
                      rows={4}
                    />
                  </div>

                  {submitError && <p className="text-sm text-red-400">{submitError}</p>}
                  {submitSuccess && <p className="text-sm text-green-400">{submitSuccess}</p>}

                  <div className="flex gap-2">
                    <button type="submit" disabled={submitting} className="px-4 py-2 rounded bg-primary text-primary-foreground w-full">
                      {submitting ? "Submitting..." : "Submit Application"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCareer(null)}
                      className="px-4 py-2 rounded border border-white/10 bg-transparent w-full"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
