import { useAppSelector } from "@/app/hooks"

function BookingPage() {
  // Read the booking selections from Redux
  const booking = useAppSelector(
    (state) => state.booking
  )

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Booking</p>
        <h1 className="mt-3 text-4xl font-medium tracking-tight text-foreground">Complete your stay</h1>

        <div className="mt-8 rounded-xl border border-border bg-card p-6">
          <p className="text-sm text-muted-foreground">Selected hotel</p>
          <p className="mt-1 font-medium text-foreground">{booking.hotelSlug ?? "No hotel selected"}</p>
          <p className="mt-6 text-sm text-muted-foreground">Selected room</p>
          <p className="mt-1 font-medium text-foreground">{booking.roomTypeId ?? "No room selected"}</p>
        </div>
      </div>
    </main>
  )
}

export default BookingPage