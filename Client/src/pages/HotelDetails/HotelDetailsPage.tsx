import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"
import { useGetHotelBySlugQuery } from "@/services/hotelApi"
import { useNavigate } from "react-router-dom"
import { useAppDispatch } from "@/app/hooks"
import { setHotelSlug, setRoomType, } from "@/features/bookings/bookingSlice"


function HotelDetailsPage() {
  const { slug } = useParams<{ slug: string }>() // reads the hotel slug from the URL
  const { data: hotel, isLoading, isError, } = useGetHotelBySlugQuery(slug ?? "") // RTK Query automatically fetches: GET
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Loading state */}
        {isLoading && (
          <p className="text-sm text-muted-foreground">Loading hotel...</p>
        )}

        {/* Error state */}
        {isError && (
          <div className="rounded-xl border border-destructive/20 bg-card p-6">
            <h1 className="text-lg font-medium text-foreground">Something went wrong</h1>
            <p className="mt-2 text-sm text-muted-foreground">We could not load this hotel</p>
          </div>
        )}

        {/* Hotel loaded successfully */}
        {!isLoading && !isError && hotel && (
          <>
            {/* Hotel heading */}
            <section>
              <p className="text-sm text-muted-foreground">{hotel.city}, {hotel.province}</p>
              <h1 className="mt-2 text-4xl font-medium tracking-tight text-foreground lg:text-5xl">{hotel.name}</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">{hotel.description}</p>
              <div className="mt-4 flex flex-wrap gap-4 text-sm">
                <span className="text-foreground">{hotel.starRating} stars</span>

                {hotel.guestRating !== null && (
                  <span className="text-muted-foreground">Guest rating: {hotel.guestRating}</span>
                )}
              </div>
            </section>

            {/* Main hotel image */}
            <section className="mt-10">
              <div className="aspect-[16/7] overflow-hidden rounded-xl bg-muted">
                <img
                     src={hotel.mainImage}
                     alt={hotel.name}
                     className="h-full w-full object-cover" />
              </div>
            </section>

            {/* Rooms + hotel information */}
            <section className="mt-12 grid gap-10 lg:grid-cols-[1fr_320px]">
              <div>
                <h2 className="text-2xl font-medium text-foreground">Available rooms</h2>

                <p className="mt-2 text-sm text-muted-foreground">Choose the room type that works best for your stay.</p>

                <div className="mt-6 space-y-4">
                  {hotel.rooms.length > 0 ? (
                    hotel.rooms.map((room) => (
                      <Card key={room.id}>
                        <CardHeader>
                          <CardTitle className="text-lg">{room.name}</CardTitle>
                        </CardHeader>

                        <CardContent>
                          {room.description && (
                            <p className="mb-4 text-sm text-muted-foreground">{room.description}</p>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                              <p className="text-sm text-muted-foreground">Up to {room.capacity} guests</p>
                              <p className="mt-1 text-sm text-muted-foreground">{room.quantity} rooms available</p>
                              <p className="mt-2 text-lg font-semibold text-foreground">R{Number(room.price).toLocaleString("en-ZA",)}{" "}/ night</p>
                            </div>

                            <Button
                                    onClick={() => {
                                     // Save selected hotel in Redux
                                    dispatch(setHotelSlug(hotel.slug))

                                    // Save selected room type in Redux
                                    dispatch(setRoomType(room.id))

                                   // Go to booking page
                                   navigate("/booking")
                                    }}> Choose room</Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No rooms are currently available.
                    </p>
                  )}
                </div>
              </div>

              {/* Hotel information */}
              <aside>
                <Card>
                  <CardHeader>
                    <CardTitle> Hotel information</CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Address</p>
                      <p className="mt-1 text-foreground">{hotel.address}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Location</p>
                      <p className="mt-1 text-foreground">{hotel.city}, {hotel.province},{" "}{hotel.country}</p>
                    </div>

                    <div>
                      <p className="text-muted-foreground">Star rating</p>
                      <p className="mt-1 text-foreground">{hotel.starRating} stars</p>
                    </div>

                    {hotel.guestRating !== null && (
                      <div>
                        <p className="text-muted-foreground">Guest rating</p>
                        <p className="mt-1 text-foreground">{hotel.guestRating} / 5</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </aside>
            </section>
          </>
        )}
      </div>
    </main>
  )
}

export default HotelDetailsPage