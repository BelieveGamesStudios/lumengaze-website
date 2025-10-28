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
              <p className="text-sm text-muted-foreground line-clamp-2">{career.description}</p>
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
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedCareer.description}</p>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3">Requirements</h3>
                <p className="text-muted-foreground whitespace-pre-wrap">{selectedCareer.requirements}</p>
              </div>

              <Button className="w-full" size="lg">
                Apply Now By Sending A Mail to afolabifunmilade229@gmail.com
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
