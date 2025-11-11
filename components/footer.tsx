import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-background/50 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="font-bold mb-4 gradient-text">LumenGaze</h3>
            <p className="text-sm text-muted-foreground">Bringing New Dimension To Reality.</p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#projects" className="hover:text-primary transition">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="#events" className="hover:text-primary transition">
                  Events
                </Link>
              </li>
              <li>
                <Link href="#blog" className="hover:text-primary transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  About
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Press
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Privacy
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Terms
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary transition">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">© 2025 LumenGaze. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a
              href="https://x.com/lumengaze?s=11"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              X
            </a>
            <a
              href="https://www.linkedin.com/in/believe-studios?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              LinkedIn
            </a>
            <a
              href="https://github.com/BelieveGamesStudios?tab=repositories"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
