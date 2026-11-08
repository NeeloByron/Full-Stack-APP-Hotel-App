import { Link } from "react-router-dom"
import embassyLogo from "@/assets/theembassy-logo.png"

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Home", path: "/" },
      { label: "Find a stay", path: "/hotels" },
      { label: "My bookings", path: "/bookings" },
    ],
  },
  {
    title: "Your account",
    links: [
      { label: "Your profile", path: "/profile" },
      { label: "Hosting workspace", path: "/hosting" },
    ],
  },
]

function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30">
      <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-12 sm:px-8 lg:px-12">
        <div className="grid gap-10 pb-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link
              to="/"
              aria-label="TheEmbassy home"
              className="inline-flex items-center gap-3">
              <img
                src={embassyLogo}
                alt=""
                className="size-12 object-contain"/>

              <span className="text-2xl font-bold tracking-tight">TheEmbassy</span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-muted-foreground">
              From city stays to quiet escapes, find your
              kind of stay in South Africa.
            </p>
          </div>

          {/* Navigation groups */}
          {footerLinks.map((group) => (
            <nav
              key={group.title}
              aria-label={`Footer ${group.title.toLowerCase()}`}>
              <h2 className="text-sm font-semibold">{group.title}</h2>

              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.path}>
                    <Link
                      to={link.path}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary hover:underline">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Copyright and location */}
        <div className="flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} TheEmbassy.
            All rights reserved.
          </p>

          <p>South Africa · English </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer