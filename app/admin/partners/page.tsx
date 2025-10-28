"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Partner {
  id: string
  name: string
  website: string | null
  description: string | null
  logo_url: string | null
  created_at: string
}

export default function PartnersAdminPage() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    website: "",
    description: "",
    logo_url: "",
  })

  useEffect(() => {
    fetchPartners()
  }, [])

  const fetchPartners = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("partners").select("*").order("created_at", { ascending: false })
    setPartners(data || [])
    setLoading(false)
  }

  const handleEdit = (partner: Partner) => {
    setEditingId(partner.id)
    setFormData({
      name: partner.name,
      website: partner.website || "",
      description: partner.description || "",
      logo_url: partner.logo_url || "",
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.website && !formData.website.startsWith("http")) {
      alert("Please enter a valid URL starting with http:// or https://")
      return
    }

    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from("partners").update(formData).eq("id", editingId)
      if (!error) {
        setEditingId(null)
        setFormData({ name: "", website: "", description: "", logo_url: "" })
        setShowForm(false)
        fetchPartners()
      }
    } else {
      const { error } = await supabase.from("partners").insert([formData])
      if (!error) {
        setFormData({ name: "", website: "", description: "", logo_url: "" })
        setShowForm(false)
        fetchPartners()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      const supabase = createClient()
      await supabase.from("partners").delete().eq("id", id)
      fetchPartners()
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ name: "", website: "", description: "", logo_url: "" })
    setShowForm(false)
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Partners</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Add Partner"}</Button>
      </div>

      {showForm && (
        <Card className="glass border-white/20 mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Partner name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Logo URL</label>
              <Input
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                placeholder="https://example.com/logo.png"
                type="url"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
                type="url"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Partner description"
                className="w-full px-3 py-2 rounded-lg bg-card/50 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                rows={3}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Partner" : "Add Partner"}
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
          {partners.map((partner) => (
            <Card key={partner.id} className="glass border-white/20">
              <CardHeader className="pb-3">
                <CardTitle>{partner.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {partner.website && <p className="text-sm text-primary mb-2">{partner.website}</p>}
                {partner.description && <p className="text-sm text-muted-foreground mb-4">{partner.description}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleEdit(partner)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(partner.id)}
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
