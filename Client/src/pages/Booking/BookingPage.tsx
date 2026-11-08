import { useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/app/hooks"
import { setCheckIn, setCheckOut, setGuests, setRooms, } from "@/features/bookings/bookingSlice"
import { useGetHotelBySlugQuery } from "@/services/hotelApi"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCreateBookingMutation } from "@/features/bookings/bookingApi"
import { useAuth0 } from "@auth0/auth0-react"
import { toast } from "sonner"


function BookingPage() {
  const dispatch = useAppDispatch() // gives us access to redux actions
  const booking = useAppSelector( // get the user's current booking choices from redux
    (state) => state.booking
  )

  // Get the selected hotel from the backend
  const { data: hotel, isLoading, isError,} = useGetHotelBySlugQuery( booking.hotelSlug ?? "", {
        // Do not make the API request if no hotel was selected
        skip: !booking.hotelSlug,
     }
   )

  const [ createBooking, { 
                           isLoading: isCreatingBooking, 
                           error: createBookingError, },] = useCreateBookingMutation()

  const {
          isAuthenticated,
          loginWithRedirect,
          getAccessTokenSilently,
        } = useAuth0()

   // Find the room selected on HotelDetailsPage
  const selectedRoom = hotel?.rooms.find( (room) => room.id === booking.roomTypeId)

   // Calculate how many nights the guest is staying
  const nights = useMemo(() => {
                                // We need both dates before calculating
                               if (!booking.checkIn || !booking.checkOut) {
                               return 0 }

  const checkInDate = new Date(booking.checkIn)
  const checkOutDate = new Date(booking.checkOut)

   // Difference between the dates in milliseconds
  const difference = checkOutDate.getTime() - checkInDate.getTime()

  // Convert milliseconds into days
  const numberOfNights = difference / (1000 * 60 * 60 * 24)

     // Do not allow negative nights
     return numberOfNights > 0 ? numberOfNights : 0
      }, [
           booking.checkIn,
           booking.checkOut,
         ])

  const nightlyPrice = selectedRoom ? Number(selectedRoom.price) : 0 // Convert Prisma Decimal/string room price into a number
  const totalPrice = nights * nightlyPrice *booking.rooms // Final booking total 
  const datesAreValid = booking.checkIn !== "" && booking.checkOut !== "" && nights > 0  // Check whether the dates are valid
  const roomsAreAvailable = selectedRoom ? booking.rooms <= selectedRoom.quantity: false // Check whether enough rooms are available
  const bookingIsValid = selectedRoom && datesAreValid && roomsAreAvailable && booking.guests > 0 && booking.rooms > 0 // Basic validation before we allow the booking
  
   // Loading hotel/room information
   if (isLoading) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-muted-foreground">Loading booking...</p>
      </main>
    )
  }


  // Hotel could not be loaded
  if (isError) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">
        <p className="text-sm text-muted-foreground">We could not load your booking information.</p>
      </main>
    )
  }

  // User opened /booking without choosing a hotel/room
  if (!hotel || !selectedRoom) {
    return (
      <main className="mx-auto max-w-5xl px-6 py-16">

        <Card>
          <CardHeader>
            <CardTitle> No room selected</CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground">Go back to the hotel page and choose a room first.</p>
          </CardContent>
        </Card>

      </main>
    )
  }

  async function handleCreateBooking() {
    
  // Make sure all required booking information exists.
  if (!hotel || !selectedRoom || !booking.checkIn || !booking.checkOut || !bookingIsValid
  ) {
    return
  }

  // if the user is not logged in, send them to Auth0 first
  if (!isAuthenticated) {
    await loginWithRedirect({
      appState: {
        returnTo: "/booking",
      },
    })
    return
  }

  try {
    // Get the Auth0 acces token
    const accessToken = await getAccessTokenSilently()

    // if error in sign in 
    if (typeof accessToken !== "string") {
      toast.error("Could not verify your login. Please sign again.")
      return
    }

    // Send the booking information to the backend.
    const result = await createBooking({
      accessToken, 

      booking: { 
                 hotelId: hotel.id,
                 roomTypeId: selectedRoom.id,

                 checkIn: booking.checkIn,
                 checkOut: booking.checkOut,

                 guests: booking.guests,
                 rooms: booking.rooms,
              },
      }).unwrap()

     // Start payment for the booking we just created.
    const paymentResponse = await fetch( "/api/payments/initialize",
    {
      method: "POST",

      headers: {
       Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
     },
  
      body: JSON.stringify({
      bookingId: result.data.id,
     }),
   },
 )

 const paymentResult = await paymentResponse.json()

 // Make sure Paystack initialization worked.
 if ( !paymentResponse.ok || !paymentResult.success ) {
   throw new Error( paymentResult.message || "Could not start payment.", )
}

 // Paystack gives us a secure checkout URL.
 const authorizationUrl = paymentResult.data.authorization_url

 if (!authorizationUrl) {
  throw new Error( "Payment checkout URL was not returned.", )
}

 // Send the user to Paystack's secure card payment page.
  window.location.href = authorizationUrl
    } catch (error) { console.error("Booking failed:", error)
      toast.error( "We could not create your booking. Please try again." )
    }
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-12">

        {/* Page heading */}
        <div>
             <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Booking</p>
             <h1 className="mt-3 text-4xl font-medium tracking-tight text-foreground">Complete your stay</h1>
             <p className="mt-3 text-sm text-muted-foreground">{hotel.name} · {selectedRoom.name}</p>
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_340px]">

          {/* Booking form */}
          <Card>

            <CardHeader>
              <CardTitle>Stay details</CardTitle>
            </CardHeader>


             <CardContent className="space-y-6">
              {/* Dates */}
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Check-in */}
                <div>
                  <label
                        htmlFor="checkIn"
                        className="mb-2 block text-sm font-medium">
                    Check-in
                  </label>

                  <Input
                        id="checkIn"
                        type="date"
                        value={booking.checkIn}
                        onChange={(event) =>
                         dispatch(
                          setCheckIn(event.target.value))} />
                </div>


                {/* Check-out */}
                <div>
                  <label
                        htmlFor="checkOut"
                        className="mb-2 block text-sm font-medium">Check-out</label>

                  <Input
                        id="checkOut"
                        type="date"
                        value={booking.checkOut}
                        min={booking.checkIn || undefined}
                        onChange={(event) =>
                         dispatch(
                              setCheckOut(event.target.value))} />
                </div>
              </div>


              {/* Guests + rooms */}
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Guests */}
                <div>
                  <label
                         htmlFor="guests"
                         className="mb-2 block text-sm font-medium">Guests</label>

                  <Input
                        id="guests"
                        type="number"
                        min={1}
                        max={selectedRoom.capacity * booking.rooms}
                        value={booking.guests}
                        onChange={(event) =>
                                  dispatch(
                                   setGuests(
                            Number(event.target.value)))}/>
                </div>


                {/* Rooms */}
                <div>
                  <label
                         htmlFor="rooms"
                         className="mb-2 block text-sm font-medium">Rooms</label>

                  <Input
                        id="rooms"
                        type="number"
                        min={1}
                        max={selectedRoom.quantity}
                        value={booking.rooms}
                        onChange={(event) =>
                          dispatch(
                           setRooms(
                            Number(event.target.value)
                          )
                        )
                      }/>

                  <p className="mt-2 text-xs text-muted-foreground">{selectedRoom.quantity} rooms available</p>
                </div>
              </div>


              {/* Invalid date message */}
              {booking.checkIn && booking.checkOut &&
                nights === 0 && (
                  <p className="text-sm text-destructive">Check-out must be after check-in.</p>
                )}


              {/* Availability message */}
              {!roomsAreAvailable && (
                <p className="text-sm text-destructive">There are not enough rooms available.</p>
              )}

            </CardContent>

          </Card>


          {/* Booking summary */}
          <aside>

            <Card>

              <CardHeader>
                <CardTitle>Booking summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                <div>
                  <p className="text-sm text-muted-foreground">Hotel</p>
                  <p className="mt-1 font-medium">{hotel.name}</p>
                </div>


                <div>
                  <p className="text-sm text-muted-foreground">Room</p>
                  <p className="mt-1 font-medium">{selectedRoom.name}</p>
                </div>


                <div>
                  <p className="text-sm text-muted-foreground"> Nightly price</p>
                  <p className="mt-1 font-medium">
                    R
                    {nightlyPrice.toLocaleString(
                      "en-ZA"
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Nights</p>
                  <p className="mt-1 font-medium">{nights}</p>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">Rooms</p>
                  <p className="mt-1 font-medium">{booking.rooms}</p>
                </div>

                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground">Total</p>
                  <p className="mt-1 text-2xl font-semibold">R{totalPrice.toLocaleString("en-ZA")}</p>
                </div>

                <Button className="w-full" onClick={handleCreateBooking} disabled={!bookingIsValid || isCreatingBooking}>{isCreatingBooking ? "Preparing payment..." : `Continue to payment · R${totalPrice.toLocaleString("en-ZA", )}`}</Button>
                {createBookingError && (
                                         <p className="text-sm text-destructive">
                                                                                 We could not create your booking.
                                                                                 Please try again.</p>
                )}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>
    </main>
  )
 }

export default BookingPage 
