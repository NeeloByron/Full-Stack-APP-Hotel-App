import { useParams } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, } from "@/components/ui/card"

const hotelDetails = {
  id: "the-fern-house",
  name: "The Fern House",
  location: "Sandton, Johannesburg",
  address: "24 Rivonia Road, Sandton, Johannesburg",
  rating: 4.9,
  stars: 5,
  description:
    "A modern hotel in the heart of Sandton, designed for business travellers and short city stays.",
  images: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
  ],
  facilities: [
    "Free Wi-Fi",
    "Swimming pool",
    "Free parking",
    "Restaurant",
    "24-hour reception",
    "Airport shuttle",
  ],
  policies: [
    "Check-in from 14:00",
    "Check-out before 11:00",
    "No smoking",
    "Pets are not allowed",
  ],
  rooms: [
    {
      id: "standard-room",
      name: "Standard Room",
      capacity: 2,
      price: 1850,
    },
    {
      id: "deluxe-room",
      name: "Deluxe Room",
      capacity: 2,
      price: 2350,
    },
  ],
}

function HotelDetailsPage() {
  const { id } = useParams()

  const hotel =
    id === hotelDetails.id
      ? hotelDetails
      : hotelDetails

  return (
    <main className="mx-auto max-w-7xl px-6 py-10 lg:py-14">
      {/* Header */}
      <section className="mb-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Hotel details</p>

            <h1 className="mt-3 text-4xl font-medium tracking-[-0.03em] text-foreground">{hotel.name}</h1>

            <p className="mt-2 text-sm text-muted-foreground">{hotel.address}</p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant="outline">{hotel.stars} stars</Badge>

            <Badge>★ {hotel.rating}
            </Badge>
          </div>
        </div>
      </section>

      {/* Image gallery */}
      <section className="grid gap-4 lg:grid-cols-2">
        <img
             src={hotel.images[0]}
             alt={`${hotel.name} main view`}
             className="aspect-[4/3] w-full rounded-xl object-cover"/>

        <div className="grid gap-4 sm:grid-cols-2">
          <img
               src={hotel.images[1]}
               alt={`${hotel.name} room`}
               className="aspect-[4/3] h-full w-full rounded-xl object-cover"/>

          <img
              src={hotel.images[2]}
              alt={`${hotel.name} interior`}
              className="aspect-[4/3] h-full w-full rounded-xl object-cover"/>
        </div>
      </section>

      {/* Main content */}
      <section className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          {/* About */}
          <div>
            <h2 className="text-2xl font-medium text-foreground">About this hotel</h2>

            <p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{hotel.description}</p>
          </div>

          {/* Facilities */}
          <div>
            <h2 className="text-2xl font-medium text-foreground">Facilities</h2>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {hotel.facilities.map((facility) => (
                <div
                  key={facility}
                  className="rounded-lg border border-border bg-card px-4 py-3 text-sm text-foreground"
                >
                  {facility}
                </div>
              ))}
            </div>
          </div>

          {/* Policies */}
          <div>
            <h2 className="text-2xl font-medium text-foreground">Hotel policies</h2>

            <div className="mt-5 space-y-3">
              {hotel.policies.map((policy) => (
                <p
                  key={policy}
                  className="text-sm text-muted-foreground"
                >
                  {policy}
                </p>
              ))}
            </div>
          </div>

          {/* Rooms */}
          <div>
            <h2 className="text-2xl font-medium text-foreground">Available rooms</h2>

            <div className="mt-5 space-y-4">
              {hotel.rooms.map((room) => (
                <Card key={room.id}>
                  <CardHeader>
                    <CardTitle>{room.name}</CardTitle>
                  </CardHeader>

                  <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Up to {room.capacity} guests
                      </p>

                      <p className="mt-2 text-sm text-foreground">
                        <span className="text-lg font-semibold">
                          R{room.price}
                        </span>{" "}
                        / night
                      </p>
                    </div>

                    <Button>
                      Select room
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Map placeholder */}
          <div>
            <h2 className="text-2xl font-medium text-foreground">
              Location
            </h2>

            <div className="mt-5 flex min-h-[260px] items-center justify-center rounded-xl border border-border bg-muted text-sm text-muted-foreground">
              Map will appear here
            </div>
          </div>

          {/* Reviews */}
          <div>
            <h2 className="text-2xl font-medium text-foreground">
              Guest reviews
            </h2>

            <Card className="mt-5">
              <CardContent className="space-y-3 p-5">
                <p className="text-sm font-medium text-foreground">
                  ★★★★★
                </p>

                <p className="text-sm leading-6 text-muted-foreground">
                  Great location, clean rooms and very friendly staff.
                </p>

                <p className="text-xs text-muted-foreground">
                  — Recent guest
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Booking summary */}
        <aside>
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle>Book your stay</CardTitle>
            </CardHeader>

            <CardContent className="space-y-5">
              <div>
                <p className="text-sm text-muted-foreground">
                  Starting from
                </p>

                <p className="mt-1 text-2xl font-semibold text-foreground">
                  R{hotel.rooms[0].price}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / night
                  </span>
                </p>
              </div>

              <Button className="w-full">
                Check availability
              </Button>
            </CardContent>
          </Card>
        </aside>
      </section>
    </main>
  )
}

export default HotelDetailsPage