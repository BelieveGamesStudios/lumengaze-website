"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  description: string | null
  date: string
  location: string | null
  image_url: string | null
}

export function EventsSection() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from("events")
        .select("*")
        .gte("date", new Date().toISOString())
        .order("date", { ascending: true })
        .limit(3)

      setEvents(data || [])
      setLoading(false)
    }

    fetchEvents()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <section id="events" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">Upcoming Events</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Join us for exclusive XR experiences and networking opportunities
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="glass rounded-lg h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {events.length > 0 ? (
            events.map((event) => (
              <Card key={event.id} className="glass border-white/20 hover:border-accent/50 transition">
                <CardHeader>
                  <CardTitle className="text-lg">{event.title}</CardTitle>
                  <CardDescription className="text-xs">📅 {formatDate(event.date)}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {event.location && <p className="text-sm text-muted-foreground">📍 {event.location}</p>}
                  {event.description && (
                    <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
                  )}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground">No upcoming events. Stay tuned!</p>
            </div>
          )}
        </div>
      )}
    </section>
  )
}
