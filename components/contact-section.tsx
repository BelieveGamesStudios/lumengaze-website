"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ContactSection() {
  return (
    <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass border-white/20 rounded-2xl p-12 text-center">
        <h2 className="text-4xl sm:text-5xl font-bold mb-4 gradient-text">Ready to Collaborate?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
          Let's bring your XR vision to life. Get in touch with our team to discuss your project and explore endless
          possibilities.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/contact">
            <Button size="lg">Start a Conversation</Button>
          </Link>
          <a href="mailto:hello@lumengaze.com">
            <Button size="lg" variant="outline" className="bg-transparent">
              Email Us
            </Button>
          </a>
        </div>
      </div>
    </section>
  )
}
