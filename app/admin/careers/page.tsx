"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

export default function CareersAdminPage() {
  const [careers, setCareers] = useState<Career[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    department: "",
    location: "",
    description: "",
    requirements: "",
    salary_range: "",
    employment_type: "Full-time",
  })

  useEffect(() => {
    fetchCareers()
  }, [])

  const fetchCareers = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("careers").select("*").order("created_at", { ascending: false })
    setCareers(data || [])
    setLoading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from("careers").update(formData).eq("id", editingId)
      if (!error) {
        setEditingId(null)
        setFormData({
          title: "",
          department: "",
          location: "",
          description: "",
          requirements: "",
          salary_range: "",
          employment_type: "Full-time",
        })
        setShowForm(false)
        fetchCareers()
      }
    } else {
      const { error } = await supabase.from("careers").insert([formData])
      if (!error) {
        setFormData({
          title: "",
          department: "",
          location: "",
          description: "",
          requirements: "",
          salary_range: "",
          employment_type: "Full-time",
        })
        setShowForm(false)
        fetchCareers()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      const supabase = createClient()
      await supabase.from("careers").delete().eq("id", id)
      fetchCareers()
    }
  }

  const handleEdit = (career: Career) => {
    setFormData({
      title: career.title,
      department: career.department,
      location: career.location,
      description: career.description,
      requirements: career.requirements,
      salary_range: career.salary_range || "",
      employment_type: career.employment_type,
    })
    setEditingId(career.id)
    setShowForm(true)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Careers</h1>
        <Button
          onClick={() => {
            setShowForm(!showForm)
            if (showForm) {
              setEditingId(null)
              setFormData({
                title: "",
                department: "",
                location: "",
                description: "",
                requirements: "",
                salary_range: "",
                employment_type: "Full-time",
              })
            }
          }}
        >
          {showForm ? "Cancel" : "Add Position"}
        </Button>
      </div>

      {showForm && (
        <Card className="glass border-white/20 mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Job Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., AR Developer"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Department</label>
              <Input
                value={formData.department}
                onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                placeholder="e.g., Engineering"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., San Francisco, CA"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Employment Type</label>
              <select
                value={formData.employment_type}
                onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                className="w-full px-3 py-2 rounded-lg bg-card/50 border border-white/20 text-foreground focus:outline-none focus:border-primary/50"
              >
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
                <option value="Contract">Contract</option>
                <option value="Internship">Internship</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Salary Range (Optional)</label>
              <Input
                value={formData.salary_range}
                onChange={(e) => setFormData({ ...formData, salary_range: e.target.value })}
                placeholder="e.g., $80,000 - $120,000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Job Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe the role and responsibilities"
                className="w-full px-3 py-2 rounded-lg bg-card/50 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                rows={5}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Requirements</label>
              <textarea
                value={formData.requirements}
                onChange={(e) => setFormData({ ...formData, requirements: e.target.value })}
                placeholder="List the required qualifications and skills"
                className="w-full px-3 py-2 rounded-lg bg-card/50 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                rows={5}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              {editingId ? "Update Position" : "Create Position"}
            </Button>
          </form>
        </Card>
      )}

      {loading ? (
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      ) : (
        <div className="space-y-4">
          {careers.map((career) => (
            <Card key={career.id} className="glass border-white/20">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{career.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">{career.department}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4 text-sm">
                  <p className="text-muted-foreground">
                    <span className="font-medium">Location:</span> {career.location}
                  </p>
                  <p className="text-muted-foreground">
                    <span className="font-medium">Type:</span> {career.employment_type}
                  </p>
                  {career.salary_range && (
                    <p className="text-muted-foreground">
                      <span className="font-medium">Salary:</span> {career.salary_range}
                    </p>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleEdit(career)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(career.id)}
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
