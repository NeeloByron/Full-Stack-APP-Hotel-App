import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"

// Navbar component 
function Navbar() {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
        <div className="flex flex-col leading-none">
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Stay
          </span>

          <span className="mt-1 text-xs text-muted-foreground">
            Hotel booking
          </span>
        </div>

         {/* Navigation links */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">Home</Link>
           
           {/* Link to the Hotels page */}
          <Link to="/hotels" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Hotels</Link>

          <a
            href="/bookings"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            My bookings
          </a>
        </nav>

        <Button className="rounded-lg bg-primary px-5 text-primary-foreground hover:bg-primary/90">
          Sign in
        </Button>
      </div>
    </header>
  )
}

export default Navbar