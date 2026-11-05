import HotelCard from "@/components/hotel/HotelCard"

const hotels = [
  {
    name: "The Fern House",
    slug: "the-silo-hotel",
    location: "Sandton, Johannesburg",
    price: 1850,
    rating: 4.9,
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Harbour View Hotel",
    slug: "harbour-view-hotel",
    location: "Cape Town, Western Cape",
    price: 2300,
    rating: 4.8,
    tag: "Sea view",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "The City Lodge",
    slug: "the-city-lodge",
    location: "Rosebank, Johannesburg",
    price: 1650,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
  },
]

function FeaturedHotels() {
  return (
    <section>
      <div className="mx-auto max-w-7xl px-6 py-16 lg:py-20">
        <div className="mb-8">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary"> Featured stays </p>

          <h2 className="text-3xl font-medium tracking-[-0.03em] text-foreground">Places worth checking into.</h2>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {hotels.map((hotel) => (
            <HotelCard
                       key={hotel.name}
                       slug={hotel.slug}
                       name={hotel.name}
                       location={hotel.location}
                       price={hotel.price}
                       rating={hotel.rating}
                       image={hotel.image}
                       tag={hotel.tag} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default FeaturedHotels