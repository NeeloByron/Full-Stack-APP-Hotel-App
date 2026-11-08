import { useState } from "react"
import { useLocation } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Calendar03Icon, Home01Icon, Menu01Icon,} from "@hugeicons/core-free-icons"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"

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

        <span className="rounded-full bg-muted px-4 py-2 text-xs text-muted-foreground"> Interface preview · Host APIs not connected</span>
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
        <section className="mt-10 rounded-3xl border border-dashed border-border px-6 py-16 text-center">
          <span className="mx-auto flex size-24 items-center justify-center rounded-3xl bg-primary/10 text-primary">
            <HugeiconsIcon
              icon={Home01Icon}
              size={44}
              aria-hidden="true"/>
          </span>

          <h2 className="mt-6 text-2xl font-semibold"> Make room for your first listing</h2>

          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
            Your properties, room types, and publishing status
            will appear here once hotel management is connected.
          </p>

          <Button
            disabled
            className="mt-6 rounded-full">Create listing — coming soon </Button>
        </section>
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

export default HostPage