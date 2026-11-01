import { useMemo, useState } from "react"
import HotelCard from "@/components/hotel/HotelCard"
import HotelFilters from "@/components/hotel/HotelFilters"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"

const hotels = [
  {
    name: "The Fern House",
    location: "Sandton, Johannesburg",
    price: 1850,
    rating: 4.9,
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Harbour View Hotel",
    location: "Cape Town, Western Cape",
    price: 2300,
    rating: 4.8,
    tag: "Sea view",
    image:
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "The City Lodge",
    location: "Rosebank, Johannesburg",
    price: 1650,
    rating: 4.7,
    image:
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Ocean House",
    location: "Umhlanga, Durban",
    price: 2100,
    rating: 4.8,
    tag: "Beachfront",
    image:
      "https://images.unsplash.com/photo-1455587734955-081b22074882?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "The Park Residence",
    location: "Pretoria, Gauteng",
    price: 1450,
    rating: 4.6,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
  },
  {
    name: "Mountain View Retreat",
    location: "Stellenbosch, Western Cape",
    price: 2750,
    rating: 4.9,
    tag: "Top rated",
    image:
      "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
  },
]

function HotelsPage() {
    const [searchTerm, setSearchTerm] = useState("")
    const [sortBy, setSortBy] = useState("recommended")

    const filteredHotels = useMemo(() => {
    const search = searchTerm.toLowerCase().trim()

    let results = hotels.filter((hotel) => {
     return (
         hotel.name.toLowerCase().includes(search) ||
         hotel.location.toLowerCase().includes(search)
       )
     })

    if (sortBy === "price-low") {
        results = [...results].sort((a, b) => a.price - b.price)}

    if (sortBy === "price-high") {
        results = [...results].sort((a, b) => b.price - a.price)}

    if (sortBy === "rating") {
       results = [...results].sort((a, b) => b.rating - a.rating)}

     return results
}, [searchTerm, sortBy])
    
  return (
    
    <div className="min-h-screen bg-background">

      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">
        <div className="mb-10">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Explore stays</p>

          <h1 className="text-4xl font-medium tracking-[-0.03em] text-foreground">Find your next hotel.</h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Browse hotels and compare locations, prices and ratings.</p>
        </div>

        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">
          <Input
                type="search"
                placeholder="Search by hotel or location..."
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="max-w-md" />

          <Select value={sortBy} onValueChange={(value) => setSortBy(value ?? "recommended")}>
            <SelectTrigger className="w-full md:w-[190px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="recommended">Recommended</SelectItem>

              <SelectItem value="price-low">Price: low to high</SelectItem>

              <SelectItem value="price-high">Price: high to low</SelectItem>

              <SelectItem value="rating">Highest rated</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <HotelFilters />

          <div>
            <p className="mb-5 text-sm text-muted-foreground">{filteredHotels.length} hotels found</p>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => (
                <HotelCard
                          key={hotel.name}
                          name={hotel.name}
                          location={hotel.location}
                          price={hotel.price}
                          rating={hotel.rating}
                          image={hotel.image}
                          tag={hotel.tag} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default HotelsPage