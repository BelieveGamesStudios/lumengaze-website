"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface Partner {
  id: string
  name: string
  logo_url: string | null
  website: string | null
  description: string | null
}

export function PartnersSection() {
  const [partners, setPartners] = useState<Partner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPartners = async () => {
      const supabase = createClient()
      const { data } = await supabase.from("partners").select("*").limit(6)

      setPartners(data || [])
      setLoading(false)
    }

    fetchPartners()
  }, [])

  return (
    <section id="partners" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-12">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">Our Partners</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Collaborating with industry leaders to bring innovative XR experiences to life
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-lg h-48 animate-pulse" />
          ))}
        </div>
      ) : partners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {partners.map((partner) => (
            <Card
              key={partner.id}
              className="glass border-white/20 hover:border-primary/50 transition overflow-hidden group"
            >
              <div className="h-32 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                {partner.logo_url ? (
                  <img
                    src={partner.logo_url || "/placeholder.svg"}
                    alt={partner.name}
                    className="max-w-[80%] max-h-[80%] object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = "none"
                    }}
                  />
                ) : (
                  <div className="text-4xl">🏢</div>
                )}
              </div>
              <CardHeader>
                <CardTitle className="text-lg">{partner.name}</CardTitle>
              </CardHeader>
              <CardContent>
                {partner.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{partner.description}</p>
                )}
                {partner.website && (
                  <a
                    href={partner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline"
                  >
                    Visit Website →
                  </a>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No partners yet. Check back soon!</p>
        </div>
      )}
    </section>
  )
}
