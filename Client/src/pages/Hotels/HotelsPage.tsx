// react hooks 
// useEffect = run code when the page loads
// useMemo = calculate/filter data efficiently
// useState = store values that can change
import { useMemo, useState } from "react" 
import HotelCard from "@/components/hotel/HotelCard"
import HotelFilters from "@/components/hotel/HotelFilters"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { useGetHotelsQuery, type Hotel, } from "@/services/hotelApi"

// finds the cheapest room price for a hotel 
function getLowestRoomPrice(hotel: Hotel) {
  // If the hotel has no rooms, return 0
  if (hotel.rooms.length === 0) {
    return 0
  }

  // Convert room prices into numbers and return the cheapest price
  return Math.min(
    ...hotel.rooms.map((room) => Number(room.price))
  )
}

function HotelsPage() {
    // RTK query automatically - fetches GET /api/hotels - stores the returned data, handles loading state, handles error state & caches the hotel data 
    const { data: hotels = [], isLoading, isError,} = useGetHotelsQuery()

    const [searchTerm, setSearchTerm] = useState("") // Stores what the user types in the search box
    const [sortBy, setSortBy] = useState("recommended") // Stores which sorting option the user selected
    const [priceFilters, setPriceFilters] = useState<string[]>([]) // Stores selected price filters
    const [ratingFilters, setRatingFilters] = useState<number[]>([]) // Stores selected rating filters

    // adds or removes a selected filters
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
    const price = getLowestRoomPrice(hotel) // finds the cheapest room at this hotel
    const matchesSearch = hotel.name.toLowerCase().includes(search) || `${hotel.city} ${hotel.province}`.toLowerCase().includes(search)
    // check whether hotel name OR location matches the search  
    const matchesPrice = priceFilters.length === 0 || priceFilters.some((filter) => {
        if (filter === "under-1500") {
          return price < 1500
        }

        if (filter === "1500-2500") {
          return price >= 1500 && price <= 2500
        }

        if (filter === "2500-plus") {
          return price > 2500
        }

        return false
      })

   // check whether the hotel matches the selected rating filters
   const matchesRating = ratingFilters.length === 0 || ratingFilters.some((rating) => (hotel.guestRating ?? 0) >= rating)

   // Hotel must match all selected filters
    return matchesSearch && matchesPrice && matchesRating
  })

  // sort hotels from cheapest to most expensive 
  if (sortBy === "price-low") {
    results = [...results].sort((a, b) => getLowestRoomPrice(a) - getLowestRoomPrice(b))
  }

  // sort hotels from most expensive to cheapest
  if (sortBy === "price-high") {
    results = [...results].sort((a, b) => getLowestRoomPrice(b) - getLowestRoomPrice(a))
  }

  // sort hotels from highest guest rating to lowest
  if (sortBy === "rating") {
    results = [...results].sort((a, b) => (b.guestRating ?? 0) - (a.guestRating ?? 0))
  }

  // return the final filtered and sorted hotel list
  return results
  // recalculate whenever any of these values change
}, [hotels, searchTerm, sortBy, priceFilters, ratingFilters]) // recal
    
// Show this while waiting for the backend
  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p className="text-sm text-muted-foreground">Loading hotels...</p>
      </main>
    )
  }


  // Show this if fetching hotels failed
  if (isError) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <div className="rounded-xl border border-border bg-card p-8">
          <h1 className="text-lg font-medium text-foreground">Unable to load hotels</h1>
          <p className="mt-2 text-sm text-muted-foreground">We couldn't load the hotels</p>
        </div>
      </main>
    )
  }

  // Hotels page
  return (
    
     <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-7xl px-6 py-12 lg:py-16">

        {/* Page heading */}
        <div className="mb-10">

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">Explore stays</p>

          <h1 className="text-4xl font-medium tracking-[-0.03em] text-foreground">Find your next hotel.</h1>

          <p className="mt-4 max-w-xl text-sm leading-6 text-muted-foreground">Browse hotels and compare locations, prices and ratings.</p>

        </div>


        {/* Search + sorting section */}
        <div className="mb-8 flex flex-col gap-4 border-b border-border pb-8 md:flex-row md:items-center md:justify-between">

          {/* Search input */}
          <Input
                type="search"
                placeholder="Search by hotel or location..."
                value={searchTerm}
                onChange={(event) =>
                setSearchTerm(event.target.value)
            }
            className="max-w-md"/>


          {/* Sorting dropdown */}
          <Select
                  value={sortBy}
                  onValueChange={(value) =>
                  setSortBy(value ?? "recommended") }>

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


        {/* Filters on the left + hotel cards on the right */}
        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">

          {/* Hotel filters */}
          <HotelFilters
                       priceFilters={priceFilters}
                       ratingFilters={ratingFilters}
                       onPriceChange={(value) =>
                     toggleFilter(value, setPriceFilters)
                 }
            onRatingChange={(value) =>
              toggleFilter(value, setRatingFilters)} />


          {/* Hotel results */}
          <div>

            {/* Number of hotels found */}
            <p className="mb-5 text-sm text-muted-foreground">{filteredHotels.length} hotels found</p>


            {/* If hotels were found, display them */}
            {filteredHotels.length > 0 ? (

              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">

                {filteredHotels.map((hotel) => (

                  <HotelCard
                            key={hotel.id} 
                            slug={hotel.slug}
                            name={hotel.name}  // Hotel name from Neon
                            location={`${hotel.city}, ${hotel.province}`} // Combine city and province into one location
                            price={getLowestRoomPrice(hotel)} // Display the cheapest available room price
                            rating={hotel.guestRating ?? 0} // If guestRating is null, use 0
                            image={hotel.mainImage} // Hotel image stored in Neon
                  />
                ))}
              </div>
              ) : (
              // Show this if filters/search return no hotels
              <div className="rounded-xl border border-border bg-card p-10 text-center">
                <h2 className="text-lg font-medium text-foreground">No hotels found</h2>
                <p className="mt-2 text-sm text-muted-foreground">Try searching for another hotel or location</p>
              </div>
             )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default HotelsPage
