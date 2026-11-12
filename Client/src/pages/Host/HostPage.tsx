import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon,  Menu01Icon,} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import type { Hotel } from "@/services/hotelApi"
import { toast } from "sonner"


function HostPage() {
  const { pathname } = useLocation()
  const {user, isAuthenticated, isLoading, loginWithRedirect, } = useAuth0()

  const [upcoming, setUpcoming] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>()

  const section = pathname.split("/")[2] ?? "today"

  const title =
    section === "today"
      ? `Welcome, ${user?.given_name ?? "host"}`
      : section.charAt(0).toUpperCase() + section.slice(1)

  if (isLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p role="status">Loading your workspace…</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <h1 className="text-3xl font-semibold"> Your hosting workspace</h1>

        <p className="mt-3 text-muted-foreground"> Log in to explore hosting on TheEmbassy.</p>

        <Button
          className="mt-6 rounded-full"
          onClick={() =>
            loginWithRedirect({
              appState: { returnTo: pathname },
            })
          }
        > Log in </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[75vh] max-w-7xl px-5 py-10 sm:px-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-semibold tracking-tight"> {title}</h1>

       <span className="rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground">{section === "listings" ? "Hotel management" : "Interface preview"}</span>
      </div>

      {/* Today and upcoming reservations */}
      {section === "today" && (
        <>
          <div
            aria-label="Reservation period"
            className="mt-8 flex justify-center gap-3">
            <Button
              variant={upcoming ? "secondary" : "default"}
              aria-pressed={!upcoming}
              className="rounded-full px-6"
              onClick={() => setUpcoming(false)}>Today</Button>

            <Button
              variant={upcoming ? "default" : "secondary"}
              aria-pressed={upcoming}
              className="rounded-full px-6"
              onClick={() => setUpcoming(true)} > Upcoming </Button>
          </div>

          <div className="mx-auto max-w-md py-20 text-center">
            <span className="mx-auto flex size-28 items-center justify-center rounded-3xl bg-primary/10 text-primary">
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={52}
                aria-hidden="true"/>
            </span>

            <h2 className="mt-8 text-3xl font-semibold tracking-tight">
              {upcoming ? "Your next arrivals, all in one place" : "A warm welcome starts here"}</h2>

            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {upcoming ? "Upcoming reservations will appear here when we connect your host booking data."
                : "Today’s arrivals and departures will appear here when we connect your host booking data."}
            </p>
          </div>
        </>
      )}

      {/* Availability calendar */}
      {section === "calendar" && (
        <section className="mt-10 rounded-3xl border border-border p-5 sm:p-8">
          <h2 className="text-xl font-semibold"> Your availability calendar </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Date selection is a preview. Availability changes
            are not saved yet.
          </p>

          <div className="mt-8 overflow-x-auto">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              numberOfMonths={2}
              className="mx-auto"
            />
          </div>
        </section>
      )}

      {/* Host listings */}
      {section === "listings" && (
         <HostListings key={user?.sub ?? "guest"} />
       )}

      {/* Guest messages */}
      {section === "messages" && (
        <section className="mt-10 grid overflow-hidden rounded-3xl border border-border md:min-h-[480px] md:grid-cols-[320px_minmax(0,1fr)]">
          <aside className="border-b border-border p-6 md:border-b-0 md:border-r">
            <h2 className="text-xl font-semibold"> Messages </h2>

            <div className="py-14 text-center">
              <HugeiconsIcon
                icon={Menu01Icon}
                size={40}
                aria-hidden="true"
                className="mx-auto text-primary" />

              <h3 className="mt-5 font-semibold"> A place for guest conversations </h3>

              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                Your conversations will appear here when
                messaging is connected.
              </p>
            </div>
          </aside>

          <div className="flex min-h-52 items-center justify-center bg-muted/20 p-8 text-center">
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              Select a conversation to read and reply.
              Messaging is not available yet.
            </p>
          </div>
        </section>
      )}
    </main>
  )
}

function HostListings() {
  const { getAccessTokenSilently } = useAuth0()

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [loading, setLoading] = useState(true)
  const [loadFailed, setLoadFailed] = useState(false)
  const [reloadCount, setReloadCount] = useState(0)

  useEffect(() => {
    let active = true

    const controller = new AbortController()

    async function loadHotels() {
  try {
    const accessToken = await getAccessTokenSilently()

    if (!accessToken) { throw new Error( "Please log in again.", )
    }

    const response = await fetch( "/api/hotels/admin/all", {
        headers: {
          Authorization:
            `Bearer ${accessToken}`,
        },

        signal: controller.signal,
      },
    )

    const result =
      await response.json()

    if (
      !response.ok ||
      !result.success
    ) {
      throw new Error(
        result.message ?? "Could not load your hotels.",
      )
    }

    if (!Array.isArray(result.data)) {
      throw new Error( "The server returned an invalid hotel list.", )
    }

    if (active) {
      setHotels(result.data)
      setLoadFailed(false)
    }
  } catch (error) {
    if (active) {
      const message = error instanceof Error ? error.message : "Could not load your hotels."
      setLoadFailed(true)

       toast.error( "Could not load hotel listings",
        {
          description: message,
        },)
     }
      } finally {
       if (active) {
        setLoading(false)
       }
     }
   }

    void loadHotels() 

    return () => {
                  active = false 
                  controller.abort()
    }
  }, [getAccessTokenSilently, reloadCount,])

  function reloadHotels() {
    setLoading(true)
    setLoadFailed(false)

    setReloadCount(
      (count) => count + 1,
    )
  }

  async function togglePublishStatus(hotel: Hotel) {
  try {
    const accessToken = await getAccessTokenSilently()

    if (!accessToken) {
      throw new Error("Please log in again.")
    }

    const response = await fetch(
      `/api/hotels/${hotel.id}/publish`,
      {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },

        body: JSON.stringify({
          active: !hotel.active,
        }),
      },
    )

    const result = await response.json()

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ??
          "Could not update hotel status.",
      )
    }

    setHotels((currentHotels) =>
      currentHotels.map((currentHotel) =>
        currentHotel.id === hotel.id
          ? {
              ...currentHotel,
              active: result.data.active,
            }
          : currentHotel,
      ),
    )

    toast.success(
      result.data.active
        ? "Hotel published"
        : "Hotel unpublished",
      {
        description: result.data.active
          ? `${hotel.name} is now visible to guests.`
          : `${hotel.name} is now hidden from guests.`,
      },
    )
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Could not update hotel status."

    toast.error(
      "Could not update hotel",
      {
        description: message,
      },
    )
  }
}

if (loading) {
  return (
    <p role="status" className="mt-10 text-sm text-muted-foreground"> Loading your hotel listings… </p>
  )
}

if (loadFailed) {
  return (
    <section className="mt-10 text-center">
      <Button
               variant="outline"
               className="rounded-full"
               onClick={reloadHotels}> Try loading listings again
      </Button>
    </section>
  )
}

  return (
    <section className="mt-10">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Your hotel listings</h2>
          <p className="mt-2 text-sm text-muted-foreground">{hotels.length}{" "}{hotels.length === 1 ? "hotel" : "hotels"}</p>
        </div>

        <Button
          variant="outline"
          className="rounded-full"
          onClick={reloadHotels}>Refresh</Button>
      </div>

      {hotels.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-border p-10 text-center text-muted-foreground">
          No hotels have been added yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {hotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="overflow-hidden rounded-2xl p-0">
              <div className="relative">
                <img
                  src={hotel.mainImage}
                  alt={hotel.name}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover"/>

                <span
                  className={[
                    "absolute left-3 top-3 rounded-full",
                    "px-3 py-1 text-xs font-semibold shadow-sm",

                    hotel.active ? "bg-primary text-primary-foreground" : "bg-background text-foreground",].join(" ")}>
                  {hotel.active ? "Published" : "Draft"}
                </span>
              </div>

             <CardContent className="space-y-3 p-5">
               <h3 className="text-lg font-semibold"> {hotel.name} </h3>
               <p className="text-sm text-muted-foreground">{hotel.city},{" "}{hotel.province} </p>

               <div className="border-t border-border pt-3 text-sm">
                  <p> {hotel.rooms.length}{" "} room types </p>
                  <p className="mt-1 text-muted-foreground">{hotel.rooms.reduce((total, room) => total + room.quantity, 0,)}{" "}rooms in total</p>
               </div>

            <div className="flex gap-3 pt-2">
             <Button
                 variant={hotel.active? "outline": "default"}
                 className="rounded-full"
                  onClick={() => togglePublishStatus(hotel) } >
                      {hotel.active ? "Unpublish" : "Publish"} </Button>
                 </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  )
}

export default HostPage