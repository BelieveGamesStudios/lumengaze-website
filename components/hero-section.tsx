"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      <div
        className="absolute inset-0 bg-cover bg-center -z-10"
        style={{
          backgroundImage:
            "url(/placeholder.svg?height=1080&width=1920&query=futuristic%20AR%20technology%20background)",
          backgroundAttachment: "fixed",
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60 -z-10" />

      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-secondary/20 -z-10" />

      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-40 right-10 w-72 h-72 bg-secondary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
      <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="mb-6 inline-block">
          <div className="glass px-4 py-2 rounded-full text-sm font-medium">✨ Welcome to the Future of XR</div>
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 gradient-text leading-tight">
          Discover LumenGaze
        </h1>

        <p className="text-lg sm:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Experience immersive extended reality that transforms how you interact with the digital world. Explore
          innovative projects that push the boundaries of what's possible.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="#projects">
            <Button size="lg" className="w-full sm:w-auto">
              Explore Projects
            </Button>
          </Link>
          <Link href="#contact">
            <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
              Get in Touch
            </Button>
          </Link>
        </div>

        {/* Featured stats */}
        <div className="grid grid-cols-3 gap-4 mt-16 max-w-2xl mx-auto">
          <div className="glass p-4 rounded-lg">
            <div className="text-2xl font-bold gradient-text">50+</div>
            <div className="text-sm text-muted-foreground">Projects</div>
          </div>
          <div className="glass p-4 rounded-lg">
            <div className="text-2xl font-bold gradient-text">100K+</div>
            <div className="text-sm text-muted-foreground">Users</div>
          </div>
          <div className="glass p-4 rounded-lg">
            <div className="text-2xl font-bold gradient-text">24/7</div>
            <div className="text-sm text-muted-foreground">Support</div>
          </div>
        </div>
      </div>
    </section>
  )
}
