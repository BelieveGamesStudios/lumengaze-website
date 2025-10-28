"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Event {
  id: string
  title: string
  date: string
  location: string | null
  description: string | null
  created_at: string
}

export default function EventsAdminPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    location: "",
    description: "",
  })

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    const supabase = createClient()
    const { data } = await supabase.from("events").select("*").order("date", { ascending: true })
    setEvents(data || [])
    setLoading(false)
  }

  const handleEdit = (event: Event) => {
    setEditingId(event.id)
    setFormData({
      title: event.title,
      date: event.date,
      location: event.location || "",
      description: event.description || "",
    })
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const supabase = createClient()

    if (editingId) {
      const { error } = await supabase.from("events").update(formData).eq("id", editingId)
      if (!error) {
        setEditingId(null)
        setFormData({ title: "", date: "", location: "", description: "" })
        setShowForm(false)
        fetchEvents()
      }
    } else {
      const { error } = await supabase.from("events").insert([formData])
      if (!error) {
        setFormData({ title: "", date: "", location: "", description: "" })
        setShowForm(false)
        fetchEvents()
      }
    }
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure?")) {
      const supabase = createClient()
      await supabase.from("events").delete().eq("id", id)
      fetchEvents()
    }
  }

  const handleCancel = () => {
    setEditingId(null)
    setFormData({ title: "", date: "", location: "", description: "" })
    setShowForm(false)
  }

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold gradient-text">Events</h1>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? "Cancel" : "Create Event"}</Button>
      </div>

      {showForm && (
        <Card className="glass border-white/20 mb-8 p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Event title"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Date & Time</label>
              <Input
                type="datetime-local"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="Event location"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Event description"
                className="w-full px-3 py-2 rounded-lg bg-card/50 border border-white/20 text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary/50"
                rows={4}
              />
            </div>
            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {editingId ? "Update Event" : "Create Event"}
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
          {events.map((event) => (
            <Card key={event.id} className="glass border-white/20">
              <CardHeader className="pb-3">
                <CardTitle>{event.title}</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">📅 {formatDate(event.date)}</p>
              </CardHeader>
              <CardContent>
                {event.location && <p className="text-sm text-muted-foreground mb-2">📍 {event.location}</p>}
                {event.description && <p className="text-sm text-muted-foreground mb-4">{event.description}</p>}
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="bg-transparent" onClick={() => handleEdit(event)}>
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent text-red-500 hover:text-red-600"
                    onClick={() => handleDelete(event.id)}
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
