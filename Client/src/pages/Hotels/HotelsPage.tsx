// react hooks 
// useEffect = run code when the page loads
// useMemo = calculate/filter data efficiently
// useState = store values that can change
import { useEffect, useMemo, useState } from "react" 
import HotelCard from "@/components/hotel/HotelCard"
import HotelFilters from "@/components/hotel/HotelFilters"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { getHotels, type Hotel, } from "@/services/hotelService" // service used to fetch hotels from our backend API

// finds the cheapest room price for a hotel 
function getLowestRoomPrice(hotel: Hotel) {
  // If the hotel has no rooms, return 0
  if (hotel.rooms.length === 0) {
    return 0
  }

  // Convert room prices into numbers and find the smallest one
  return Math.min(
    ...hotel.rooms.map((room) => Number(room.price))
  )
}

function HotelsPage() {
    const [hotels, setHotels] = useState<Hotel[]>([]) // stores all hotels that come from our backend/neon database
    const [loading, setLoading] = useState(true)  // Keeps track of whether hotel data is still loading
    const [error, setError] = useState("") // Stores an error message if the API request fails 

    const [searchTerm, setSearchTerm] = useState("") // Stores what the user types in the search box
    const [sortBy, setSortBy] = useState("recommended") // Stores which sorting option the user selected
    const [priceFilters, setPriceFilters] = useState<string[]>([]) // Stores selected price filters
    const [ratingFilters, setRatingFilters] = useState<number[]>([]) // Stores selected rating filters

    // Runs once when HotelsPage first loads
    useEffect(() => {
              async function loadHotels() {
                try {
                      setLoading(true) // Tell the page that loading has started
                      setError("") // Remove any old error 

                      const data = await getHotels() // GET /api/hotels
                      setHotels(data) // saves the hotels returned by the backend 
                    } catch (error) {
                      console.error(error)
                      setError("We couldn't load the hotels.")
                    } finally {
                      setLoading(false)
                    }
                  }
                   loadHotels()
              }, [])

    // selecting/unselecting filters
    const toggleFilter = <T,>(
      value: T,
      setFilters: React.Dispatch<React.SetStateAction<T[]>>,
    ) => {
      setFilters((filters) =>
        filters.includes(value)
          ? filters.filter((filter) => filter !== value)
          : [...filters, value],
      )
    }

    // filters and sorts the hotels
  const filteredHotels = useMemo(() => {
  const search = searchTerm.toLowerCase().trim() // Makes search lowercase so searches are easier to match

  // Start by filtering all hotels
  let results = hotels.filter((hotel) => {
    const matchesSearch =
      hotel.name.toLowerCase().includes(search) ||
      `${hotel.city} ${hotel.province}`.toLowerCase().includes(search)

    const matchesPrice =
      priceFilters.length === 0 ||
      priceFilters.some((filter) => {
        if (filter === "under-1500") {
          return hotel.price < 1500
        }

        if (filter === "1500-2500") {
          return hotel.price >= 1500 && hotel.price <= 2500
        }

        if (filter === "2500-plus") {
          return hotel.price > 2500
        }

        return false
      })

    const matchesRating =
      ratingFilters.length === 0 ||
      ratingFilters.some((rating) => hotel.rating >= rating)

    return matchesSearch && matchesPrice && matchesRating
  })

  if (sortBy === "price-low") {
    results = [...results].sort((a, b) => a.price - b.price)
  }

  if (sortBy === "price-high") {
    results = [...results].sort((a, b) => b.price - a.price)
  }

  if (sortBy === "rating") {
    results = [...results].sort((a, b) => b.rating - a.rating)
  }

  return results
}, [searchTerm, sortBy, priceFilters, ratingFilters])
    
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
          <HotelFilters
            priceFilters={priceFilters}
            ratingFilters={ratingFilters}
            onPriceChange={(value) => toggleFilter(value, setPriceFilters)}
            onRatingChange={(value) => toggleFilter(value, setRatingFilters)}
          />

          <div>
            <p className="mb-5 text-sm text-muted-foreground">{filteredHotels.length} hotels found</p>

            {filteredHotels.length > 0 ? (
             <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {filteredHotels.map((hotel) => (
               <HotelCard
                         key={hotel.id}
                         id={hotel.id}
                         name={hotel.name}
                         location={hotel.location}
                         price={hotel.price}
                         rating={hotel.rating}
                         image={hotel.image}
                         tag={hotel.tag} />
                     ))}
                  </div>
                  ) : (
                 <div className="rounded-xl border border-border bg-card p-10 text-center">
                   <h2 className="text-lg font-medium text-foreground"> No hotels found </h2>

                     <p className="mt-2 text-sm text-muted-foreground"> Try searching for another hotel or location </p>
              </div>
              )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HotelsPage