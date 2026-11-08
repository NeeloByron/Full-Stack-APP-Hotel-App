import {  useState } from "react"
import { useNavigate } from "react-router-dom"
import { HugeiconsIcon } from "@hugeicons/react"
import { Search01Icon } from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useGetHotelsQuery } from "@/services/hotelApi"
import { useAppDispatch } from "@/app/hooks"
import { setCheckIn, setCheckOut, setGuests,} from "@/features/bookings/bookingSlice"
import { format } from "date-fns"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger, } from "@/components/ui/popover"
import { Location01Icon } from "@hugeicons/core-free-icons"
import { Add01Icon, MinusSignIcon} from "@hugeicons/core-free-icons"

// Format dates using local time instead of UTC.
function formatDate(date: Date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, "0")
  const day = String(date.getDate()).padStart(2, "0")

  return `${year}-${month}-${day}`
}

function HotelSearch() {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { data: hotels = [], isLoading: destinationsLoading, isError: destinationsError, } = useGetHotelsQuery()

  const [destination, setDestination] = useState("")
  const [guestsOpen, setGuestsOpen] = useState(false)
  const [checkIn, changeCheckIn] = useState("")
  const [checkOut, changeCheckOut] = useState("")
  const [adults, setAdults] = useState(2)
  const [children, setChildren] = useState(0)
  const [infants, setInfants] = useState(0)

  const totalGuests = adults + children + infants
  const guests = String(totalGuests)

  const guestRows = [
  {
    label: "Adults",
    description: "Ages 13 or above",
    count: adults,
    minimum: 1,
    update: setAdults,
  },
  {
    label: "Children",
    description: "Ages 2–12",
    count: children,
    minimum: 0,
    update: setChildren,
  },
  {
    label: "Infants",
    description: "Under 2",
    count: infants,
    minimum: 0,
    update: setInfants,
  },
]
  const [destinationOpen, setDestinationOpen] = useState(false)

// Keep one entry for each city and province.
 const destinations = hotels
   .filter(
     (hotel, index, allHotels) =>
       index ===
       allHotels.findIndex(
         (item) =>
           item.city === hotel.city &&
           item.province === hotel.province
       )
   )
   .map((hotel) => ({
                     city: hotel.city,
                     province: hotel.province,
                    }))
  .sort((a, b) => a.city.localeCompare(b.city))

// Match destinations against what the guest types.
const matchingDestinations = destinations.filter((place) =>
  `${place.city} ${place.province}`
    .toLowerCase()
    .includes(destination.trim().toLowerCase())
)

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    // Preserve the guest's choices for the booking flow.
    dispatch(setCheckIn(checkIn))
    dispatch(setCheckOut(checkOut))
    dispatch(setGuests(Number(guests)))

    const params = new URLSearchParams({
      destination: destination.trim(),
      guests,
    })

    if (checkIn) params.set("checkIn", checkIn)
    if (checkOut) params.set("checkOut", checkOut)

    navigate(`/hotels?${params.toString()}`)
  }

  const [datesOpen, setDatesOpen] = useState(false)

const selectedDates = {
     from: checkIn ? new Date(`${checkIn}T00:00:00`) : 
     undefined, to: checkOut
    ? new Date(`${checkOut}T00:00:00`)
    : undefined,
}

const calendarToday = new Date()
calendarToday.setHours(0, 0, 0, 0)

const dateLabel = selectedDates.from
  ? selectedDates.to
    ? `${format(selectedDates.from, "d MMM")} – ${format(
        selectedDates.to,
        "d MMM"
      )}`
    : `${format(selectedDates.from, "d MMM")} – Choose checkout`
  : "Add dates"
  
  return (
    <form
      onSubmit={handleSearch}
      className="rounded-3xl border border-border bg-card p-3 text-card-foreground shadow-xl shadow-black/10 lg:rounded-full">
      <div className="grid items-center gap-2 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.4fr_1fr_auto] lg:gap-0">
        {/* Destination */}
        {/* Destination dropdown */}
<Popover
  open={destinationOpen}
  onOpenChange={setDestinationOpen}
>
  <PopoverTrigger
    render={
      <button
        type="button"
        className={[
          "flex min-h-20 w-full min-w-0 flex-col",
          "justify-center rounded-full px-6 py-3 text-left",
          "transition-colors hover:bg-muted",
          "focus-visible:outline-2 focus-visible:outline-primary",
          destinationOpen
            ? "bg-background shadow-md ring-1 ring-border"
            : "",
        ].join(" ")}
      />
    }
  >
    <span className="text-xs font-semibold text-foreground">Where</span>
    <span className="mt-1 w-full truncate text-sm text-muted-foreground">{destination || "Search destinations"}</span>
  </PopoverTrigger>

  <PopoverContent
    align="start"
    sideOffset={14}
    className="w-[380px] max-w-[calc(100vw-2rem)] rounded-3xl border-border p-4 shadow-xl" >
    <label htmlFor="destination-search" className="sr-only">Search by city or province</label>

    <Input
      id="destination-search"
      type="search"
      placeholder="Search by city or province"
      autoComplete="off"
      value={destination}
      onChange={(event) => setDestination(event.target.value)}
      className="h-11 rounded-xl" />

    <p className="px-2 pb-2 pt-5 text-xs font-medium text-muted-foreground">
      {destination.trim()
        ? "Matching destinations"
        : "Suggested destinations"}
    </p>

    <div className="max-h-72 space-y-1 overflow-y-auto">
      {destinationsLoading ? (
        <p
          role="status"
          className="px-2 py-4 text-sm text-muted-foreground">Loading destinations…
        </p>
      ) : destinationsError ? (
        <p className="px-2 py-4 text-sm text-muted-foreground">
          Suggestions are unavailable. You can still type a
          destination and search.
        </p>
      ) : matchingDestinations.length > 0 ? (
        matchingDestinations.map((place) => (
          <button
            key={`${place.city}-${place.province}`}
            type="button"
            onClick={() => {
              setDestination(place.city)
              setDestinationOpen(false)
            }}
            className="flex w-full items-center gap-4 rounded-2xl p-3 text-left transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-primary">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <HugeiconsIcon
                icon={Location01Icon}
                size={25}
                aria-hidden="true"/>
            </span>

            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">
                {place.city}
              </span>

              <span className="mt-1 block truncate text-xs text-muted-foreground">{place.province}, South Africa</span>
            </span>
          </button>
        ))
      ) : (
        <p className="px-2 py-4 text-sm text-muted-foreground">No matching destinations in our current listings.</p>
      )}
    </div>

    <div className="mt-3 flex justify-end border-t border-border pt-3">
      <Button
             type="button"
             variant="ghost"
             className="rounded-full"
             onClick={() => setDestinationOpen(false)}> Done </Button>
          </div>
        </PopoverContent>
       </Popover>

       {/* One date-range field */}
       <Popover open={datesOpen} onOpenChange={setDatesOpen}>
        <PopoverTrigger
             render={
              <button
                       type="button"
                       className={[
                                    "flex min-h-20 w-full min-w-0 flex-col",
                                    "justify-center rounded-full px-6 py-3 text-left",
                                    "transition-colors hover:bg-muted",
                                    "focus-visible:outline-2 focus-visible:outline-primary",
                                     datesOpen
                                  ? "bg-background shadow-md ring-1 ring-border" : "",  ].join(" ")} /> }>
      <span className="text-xs font-semibold text-foreground"> When </span>

    <span className="mt-1 truncate text-sm text-muted-foreground">
      {dateLabel}
    </span>
  </PopoverTrigger>

  <PopoverContent
    align="center"
    sideOffset={14}
    className="max-h-[75vh] w-auto max-w-[calc(100vw-2rem)] overflow-auto rounded-3xl border-border p-4 shadow-xl sm:p-6">
    <div className="mb-4 text-center">
      <h2 className="text-base font-semibold">When’s your next stay?</h2>
      <p className="mt-1 text-sm text-muted-foreground">Choose your check-in and check-out dates.</p>
    </div>

    <Calendar
      mode="range"
      defaultMonth={selectedDates.from ?? calendarToday}
      selected={selectedDates}
      min={1}
      disabled={{ before: calendarToday }}
      onSelect={(range) => {
        changeCheckIn(
          range?.from ? format(range.from, "yyyy-MM-dd") : ""
        )

        changeCheckOut(
          range?.to ? format(range.to, "yyyy-MM-dd") : ""
        )
      }}
      numberOfMonths={2}
      className="bg-transparent p-0"
    />

    <div className="mt-5 flex items-center justify-between border-t border-border pt-4">
      <Button
        type="button"
        variant="ghost"
        className="rounded-full"
        onClick={() => {
          changeCheckIn("")
          changeCheckOut("")
        }}
      >
        Clear dates
      </Button>

      <Button
        type="button"
        className="rounded-full px-6"
        disabled={!checkIn || !checkOut}
        onClick={() => setDatesOpen(false)}>Done</Button>
       </div>
     </PopoverContent>
     </Popover>

      {/* Guests */}
<Popover open={guestsOpen} onOpenChange={setGuestsOpen}>
  <PopoverTrigger
    render={
      <button
        type="button"
        className={[
          "flex min-h-20 w-full min-w-0 flex-col",
          "justify-center rounded-full px-6 py-3 text-left",
          "transition-colors hover:bg-muted",
          "focus-visible:outline-2 focus-visible:outline-primary",
          guestsOpen
            ? "bg-background shadow-md ring-1 ring-border"
            : "",
        ].join(" ")}
      />
    }
  >
    <span className="text-xs font-semibold text-foreground">
      Who
    </span>

    <span className="mt-1 text-sm text-muted-foreground">
      {totalGuests} {totalGuests === 1 ? "guest" : "guests"}
    </span>
  </PopoverTrigger>

  <PopoverContent
    align="end"
    sideOffset={14}
    className="w-[420px] max-w-[calc(100vw-2rem)] rounded-3xl border-border px-6 py-3 shadow-xl sm:px-8"
  >
    <h2 className="sr-only">Choose your guests</h2>

    {guestRows.map((row) => (
      <div
        key={row.label}
        className="flex items-center justify-between gap-5 border-b border-border py-6"
      >
        <div>
          <p className="text-sm font-semibold">
            {row.label}
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            {row.description}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Decrease ${row.label.toLowerCase()} count`}
            disabled={row.count <= row.minimum}
            onClick={() => row.update(row.count - 1)}
            className="size-8 rounded-full"
          >
            <HugeiconsIcon
              icon={MinusSignIcon}
              size={16}
              aria-hidden="true"
            />
          </Button>

          <span
            aria-live="polite"
            aria-atomic="true"
            className="min-w-5 text-center text-sm tabular-nums"
          >
            {row.count}
            <span className="sr-only">
              {" "}{row.label.toLowerCase()}
            </span>
          </span>

          <Button
            type="button"
            variant="outline"
            size="icon"
            aria-label={`Increase ${row.label.toLowerCase()} count`}
            disabled={totalGuests >= 8}
            onClick={() => row.update(row.count + 1)}
            className="size-8 rounded-full"
          >
            <HugeiconsIcon
              icon={Add01Icon}
              size={16}
              aria-hidden="true"
            />
          </Button>
        </div>
      </div>
    ))}

    <div className="py-5">
      <p className="text-sm font-semibold">Pets</p>

      <p className="mt-1 text-sm text-muted-foreground">
        Pet preferences aren’t supported yet.
      </p>
    </div>

    <div className="flex items-center justify-between gap-4 border-t border-border py-4">
      <p className="max-w-48 text-xs text-muted-foreground">
        Up to 8 people, including infants. Room capacity applies.
      </p>

      <Button
        type="button"
        className="rounded-full px-6"
        onClick={() => setGuestsOpen(false)}
      >
        Done
      </Button>
    </div>
  </PopoverContent>
</Popover>  

        {/* Uses your existing pink primary colour */}
        <Button
          type="submit"
          className="h-14 gap-2 rounded-full px-7 text-base font-semibold sm:col-span-2 lg:col-span-1">
          <HugeiconsIcon
            icon={Search01Icon}
            size={22}
            aria-hidden="true"/> Search </Button>
      </div>
    </form>
  )
}

export default HotelSearch