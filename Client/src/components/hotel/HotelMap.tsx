import { useEffect, useMemo } from "react"
import { Link } from "react-router-dom"
import { divIcon, latLngBounds } from "leaflet"
import { MapContainer, Marker, Popup, TileLayer, useMap,} from "react-leaflet"
import type { Hotel } from "@/services/hotelApi"
import "leaflet/dist/leaflet.css"

type HotelMapProps = {
  hotels: Hotel[]
}

type HotelWithLocation = Hotel & {
  latitude: number
  longitude: number
}

// Only use valid coordinates. Hotels without them stay in the list.
function hasLocation(hotel: Hotel): hotel is HotelWithLocation {
  return (
    typeof hotel.latitude === "number" &&
    typeof hotel.longitude === "number" &&
    Number.isFinite(hotel.latitude) &&
    Number.isFinite(hotel.longitude) &&
    Math.abs(hotel.latitude) <= 90 &&
    Math.abs(hotel.longitude) <= 180
  )
}

function getNightlyPrice(hotel: Hotel) {
  const prices = hotel.rooms
    .map((room) => Number(room.price))
    .filter((price) => Number.isFinite(price) && price > 0)

  return prices.length > 0 ? Math.min(...prices) : null
}

// Keep the map centred on the current search results.
function FitHotelLocations({
  hotels,
}: {
  hotels: HotelWithLocation[]
}) {
  const map = useMap()

  useEffect(() => {
    if (hotels.length === 0) return

    const bounds = latLngBounds(
      hotels.map((hotel) => [
        hotel.latitude,
        hotel.longitude,
      ])
    )

    map.fitBounds(bounds, {
      padding: [50, 50],
      maxZoom: 14,
      animate: false,
    })
  }, [hotels, map])

  // Refresh the map when switching between mobile list/map views.
  useEffect(() => {
    const observer = new ResizeObserver(() => {
      map.invalidateSize()
    })

    observer.observe(map.getContainer())

    return () => observer.disconnect()
  }, [map])

  return null
}

function HotelMap({ hotels }: HotelMapProps) {
  const locatedHotels = useMemo(
    () => hotels.filter(hasLocation),
    [hotels]
  )

  const missingLocations = hotels.length - locatedHotels.length

  if (locatedHotels.length === 0) {
    return (
      <div className="flex h-full min-h-80 items-center justify-center rounded-3xl border border-border bg-muted/40 p-8 text-center">
        <div>
          <h2 className="text-lg font-semibold">
            No map locations available
          </h2>

          <p className="mt-2 max-w-xs text-sm text-muted-foreground">
            {hotels.length === 0
              ? "Try changing your search or filters."
              : "These hotels haven’t added their coordinates yet. You can still browse their cards."}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative isolate h-full min-h-80 overflow-hidden rounded-3xl border border-border">
      <MapContainer
        center={[-28.5, 24.5]}
        zoom={5}
        scrollWheelZoom={false}
        className="h-full w-full"
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />

        <FitHotelLocations hotels={locatedHotels} />

        {locatedHotels.map((hotel) => {
          const price = getNightlyPrice(hotel)

          const priceLabel =
            price === null
              ? "View stay"
              : `R${price.toLocaleString("en-ZA")}`

          const priceIcon = divIcon({
            className: "hotel-price-marker",
            html: `<span class="hotel-price-label">${priceLabel}</span>`,
            iconSize: [100, 38],
            iconAnchor: [50, 19],
            popupAnchor: [0, -20],
          })

          return (
            <Marker
              key={hotel.id}
              position={[hotel.latitude, hotel.longitude]}
              icon={priceIcon}
              title={`${hotel.name}: ${priceLabel}`}
              alt={`View ${hotel.name}`}
            >
              <Popup>
                <div className="w-52">
                  <img
                    src={hotel.mainImage}
                    alt={hotel.name}
                    loading="lazy"
                    className="mb-3 aspect-[4/3] w-full rounded-xl object-cover"/>

                  <h3 className="font-semibold">
                    {hotel.name}
                  </h3>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {hotel.city}, {hotel.province}
                  </p>

                  <p className="mt-2 text-sm font-semibold">
                    {price === null
                      ? "Check room availability"
                      : `${priceLabel} / night`}
                  </p>

                  <Link
                    to={`/hotels/${hotel.slug}`}
                    className="mt-3 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-medium !text-primary-foreground"
                  >
                    View hotel
                  </Link>
                </div>
              </Popup>
            </Marker>
          )
        })}
      </MapContainer>

      {missingLocations > 0 && (
        <div
          role="status"
          className="pointer-events-none absolute inset-x-4 top-4 z-[1000] rounded-xl bg-background/95 px-3 py-2 text-xs shadow-sm">
          {missingLocations}{" "}
          {missingLocations === 1 ? "hotel has" : "hotels have"}{" "}
          no map location. All matching hotels remain in the list.
        </div>
      )}
    </div>
  )
}

export default HotelMap