import { useParams } from "react-router-dom"

// HotelDetailsPage component - renders detailed view for a specific hotel
function HotelDetailsPage() {
  const { id } = useParams() // extract the dynamic 'id" parameter from the current URL route.

  return (
    // main container handling responsive layout 
    <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Hotel details</p>

      <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-foreground">Hotel Details</h1>

      <p className="mt-4 text-sm text-muted-foreground">Hotel ID: {id}</p>
    </main>
  )
}

export default HotelDetailsPage