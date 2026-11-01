import { Button } from "@/components/ui/button"

function Navbar() {
  return (
    <header className="border-b bg-background">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-semibold">Hotel App</h1>

        <nav className="flex items-center gap-6">
          <a href="/" className="text-sm font-medium">Home</a>

          <a href="/hotels" className="text-sm font-medium">Hotels</a>

          <a href="/bookings" className="text-sm font-medium">My Bookings</a>

          <Button>Sign In</Button>
        </nav>
      </div>
    </header>
  )
}

export default Navbar