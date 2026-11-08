import HotelSearch from "@/components/ui/search/HotelSearch"
import StayHighlights from "@/components/ui/home/StayHighlights"
import FeaturedHotels from "@/components/ui/home/FeaturedHotels"

// HomePage component - Renders the main landing page of the application 
function HomePage() {
  return (
    // Main container wrapper
    <div className="min-h-screen bg-background">

      <main>
        {/* Hero section */}
        <section className="border-b border-border">
          <div className="mx-auto max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Discover South Africa</p>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-5xl">Find your kind of stay.</h1>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-6 text-muted-foreground sm:text-base">
              From city stays to quiet escapes, discover somewhere
              you’ll love coming back to.
            </p>
          </div>

            {/* Search widget */}
            <div className="mt-10">
              <HotelSearch />
            </div>
          </div>
        </section>
        <StayHighlights />
        <FeaturedHotels />
      </main>
    </div>
  )
}

export default HomePage