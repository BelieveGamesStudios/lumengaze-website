"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { ProjectsGrid } from "@/components/projects-grid"

export default function ProjectsPage() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <div className="pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-5xl sm:text-6xl font-bold mb-4 gradient-text">All Projects</h1>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Explore our complete collection of AR experiences, interactive installations, and innovative digital
              solutions.
            </p>
          </div>
          <ProjectsGrid />
        </div>
      </div>
      <Footer />
    </main>
  )
}
