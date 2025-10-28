"use client"

import Link from "next/link"
import { useState } from "react"
import { ThemeToggle } from "@/components/theme-toggle"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <header className="fixed top-0 w-full z-50 glass-dark border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <img src="/Logo.png" alt="LumenGaze Logo" className="h-8 w-8 object-contain" />
          <span className="font-bold text-lg gradient-text">LumenGaze</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <Link href="#projects" className="text-sm hover:text-primary transition">
            Projects
          </Link>
          <Link href="#events" className="text-sm hover:text-primary transition">
            Events
          </Link>
          <Link href="#blog" className="text-sm hover:text-primary transition">
            Blog
          </Link>
          <Link href="#contact" className="text-sm hover:text-primary transition">
            Contact
          </Link>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
        </div>

        <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </nav>

      {isOpen && (
        <div className="md:hidden border-t border-white/10 p-4 space-y-4">
          <Link href="#projects" className="block text-sm hover:text-primary transition">
            Projects
          </Link>
          <Link href="#events" className="block text-sm hover:text-primary transition">
            Events
          </Link>
          <Link href="#blog" className="block text-sm hover:text-primary transition">
            Blog
          </Link>
          <Link href="#contact" className="block text-sm hover:text-primary transition">
            Contact
          </Link>
          <div className="flex gap-2 pt-2">
            <ThemeToggle />
          </div>
        </div>
      )}
    </header>
  )
}
