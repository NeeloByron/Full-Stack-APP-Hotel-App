import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { useGetMyBookingsQuery, useCancelBookingMutation,  } from "@/features/bookings/bookingApi"
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

function MyBookingsPage() {
  const {
          isAuthenticated,
          isLoading: authLoading,
          getAccessTokenSilently,
          loginWithRedirect,
      } = useAuth0()

  const [accessToken, setAccessToken] = useState<string | null>(null)

  // Get Auth0 token after login.
  useEffect(() => {
    async function getToken() {
      if (authLoading) {
        return
      }

      if (!isAuthenticated) {
        await loginWithRedirect({
          appState: {
            returnTo: "/bookings",
          },
        })

        return
      }

      const token = await getAccessTokenSilently()

      if (typeof token === "string") {
        setAccessToken(token)
      }
    }

    getToken()
  }, [
    authLoading,
    isAuthenticated,
    getAccessTokenSilently,
    loginWithRedirect,
  ])

  const { data, isLoading, isError, refetch, } = useGetMyBookingsQuery(
    accessToken ?? "",
    {
      skip: !accessToken,
    },
  )

  const [ cancelBooking, { isLoading: isCancellingBooking },] = useCancelBookingMutation()


  async function handleCancelBooking( bookingId: number,) {
  if (!accessToken) {
      toast.error("Could not verify your login.",)

    return
  }

  try {
    await cancelBooking({
                          bookingId,
                          accessToken,
                        }).unwrap()

    toast.success("Booking cancelled successfully.",)

    // Reload bookings so the new CANCELLED  status appears immediately.
    await refetch()
  } catch (error) {
    console.error("Cancel booking failed:", error,)

    toast.error("We could not cancel your booking.",)
  }
} 

  if (authLoading || !accessToken || isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-muted-foreground"> Loading your bookings...</p>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-destructive"> We could not load your bookings. </p>
      </main>
    )
  }

  const bookings = data?.data ?? []

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary"> Your stays </p>
          <h1 className="mt-3 text-4xl font-medium tracking-tight"> My Bookings </h1>
          <p className="mt-3 text-sm text-muted-foreground"> View your upcoming and previous hotel bookings.</p>
        </div>

        {bookings.length === 0 ? (
          <Card className="mt-10">
            <CardContent className="py-12">
              <p className="text-sm text-muted-foreground">You don't have any bookings yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="mt-10 space-y-5">
            {bookings.map((booking) => (
              <Card key={booking.id}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <CardTitle> {booking.hotel.name}</CardTitle>
                      <p className="mt-2 text-sm text-muted-foreground"> {booking.roomType.name}</p>
                    </div>

                    <span className="rounded-full border px-3 py-1 text-xs font-medium">{booking.status}</span>
                  </div>
                </CardHeader>

                <CardContent>
  <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
    {/* Check-in */}
    <div>
      <p className="text-xs text-muted-foreground">
        Check-in
      </p>

      <p className="mt-1 text-sm font-medium">
        {new Date(
          booking.checkIn
        ).toLocaleDateString("en-ZA")}
      </p>
    </div>

    {/* Check-out */}
    <div>
      <p className="text-xs text-muted-foreground">
        Check-out
      </p>

      <p className="mt-1 text-sm font-medium">
        {new Date(
          booking.checkOut
        ).toLocaleDateString("en-ZA")}
      </p>
    </div>

    {/* Rooms */}
    <div>
      <p className="text-xs text-muted-foreground">
        Rooms
      </p>

      <p className="mt-1 text-sm font-medium">
        {booking.rooms}
      </p>
    </div>

    {/* Total */}
    <div>
      <p className="text-xs text-muted-foreground">
        Total
      </p>

      <p className="mt-1 text-sm font-semibold">
        R
        {Number(
          booking.totalPrice
        ).toLocaleString("en-ZA")}
      </p>
    </div>
  </div>

  {/* Only show cancel button for active bookings */}
  {booking.status !== "CANCELLED" &&
    booking.status !== "COMPLETED" && (
      <div className="mt-6 border-t border-border pt-4">
        <Button
          variant="outline"
          onClick={() =>
            handleCancelBooking(
              booking.id
            )
          }
          disabled={isCancellingBooking}
        >
          {isCancellingBooking
            ? "Cancelling..."
            : "Cancel booking"}
        </Button>
      </div>
    )}
</CardContent>
                
              </Card>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}

export default MyBookingsPage