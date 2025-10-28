"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { CareersGrid } from "@/components/careers-grid"

export default function CareersPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 gradient-text">Careers</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Join the LumenGaze team and help us shape the future of augmented and virtual reality experiences.
            </p>
          </div>
          <CareersGrid />
        </div>
      </div>
      <Footer />
    </main>
  )
}
