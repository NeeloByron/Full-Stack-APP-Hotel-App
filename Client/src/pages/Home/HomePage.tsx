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
          <div className="mx-auto max-w-7xl px-6 py-16 lg:py-10">
           
           {/* left column */}
            <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
              <div className="max-w-xl">
                <p className="mb-5 text-xs font-semibold uppercase tracking-[0.18em] text-primary"> Business travel</p>

                <h1 className="text-5xl font-medium leading-[0.95] tracking-[-0.04em] text-foreground lg:text-4xl">Travel.<br />
                  A little more effortless.
                </h1>
              </div>

              {/* Right Column */}
              <div className="max-w-md lg:justify-self-end">
                <p className="text-sm leading-6 text-muted-foreground"> Find comfortable stays for business trips, short breaks and everything in between.
                </p>
              </div>
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