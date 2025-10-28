import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { ProjectsPreview } from "@/components/projects-preview"
import { EventsSection } from "@/components/events-section"
import { BlogGrid } from "@/components/blog-grid"
import { PartnersSection } from "@/components/partners-section"
import { ContactSection } from "@/components/contact-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background touch-auto">
      <Header />
      <HeroSection />
      <ProjectsPreview />
      <EventsSection />
      <section id="blog" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-5xl sm:text-6xl font-bold mb-4 gradient-text">Latest Blog Posts</h2>
            <p className="text-lg text-muted-foreground max-w-2xl">
              Insights, updates, and stories from the LumenGaze team.
            </p>
          </div>
          <BlogGrid />
        </div>
      </section>
      <PartnersSection />
      <ContactSection />
      <Footer />
    </main>
  )
}
