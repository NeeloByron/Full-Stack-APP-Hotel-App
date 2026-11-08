import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { UserCircleIcon, Calendar03Icon, } from "@hugeicons/core-free-icons"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

function ProfilePage() {
  const { user, isAuthenticated, isLoading, loginWithRedirect,} = useAuth0()

  const [editing, setEditing] = useState(false)
  const [work, setWork] = useState("")
  const [destination, setDestination] = useState("")
  const [about, setAbout] = useState("")

  const name = user?.given_name ?? user?.name ?? "Guest"
  const initial = name.charAt(0).toUpperCase()

  if (isLoading) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <p role="status">Loading your profile…</p>
      </main>
    )
  }

  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-16">
        <h1 className="text-3xl font-semibold"> Your TheEmbassy profile </h1>
        <p className="mt-3 text-muted-foreground"> Log in to view your profile.</p>

        <Button
          className="mt-6 rounded-full"
          onClick={() =>
            loginWithRedirect({
              appState: { returnTo: "/profile" },
            })
          }> Log in </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto min-h-[75vh] max-w-7xl px-5 sm:px-8">
      <div className="grid md:grid-cols-[240px_minmax(0,1fr)]">
        {/* Sidebar */}
        <aside className="border-b border-border py-6 md:border-b-0 md:border-r md:py-12 md:pr-6">
          <h1 className="mb-6 text-3xl font-semibold tracking-tight">
            Profile
          </h1>

          <nav aria-label="Profile navigation" className="flex gap-2 md:flex-col" >
            <a href="#about-me" className="flex items-center gap-3 rounded-2xl bg-muted px-4 py-4 text-sm font-semibold">
              <HugeiconsIcon
                icon={UserCircleIcon}
                size={23}
                aria-hidden="true" /> About me </a>

            <Link
              to="/bookings"
              className="flex items-center gap-3 rounded-2xl px-4 py-4 text-sm transition-colors hover:bg-muted" >
              <HugeiconsIcon
                icon={Calendar03Icon}
                size={23}
                aria-hidden="true" /> My bookings </Link>
          </nav>
        </aside>

        {/* Profile content */}
        <section
          id="about-me"
          className="min-w-0 py-8 md:py-12 md:pl-12"
        >
          <div className="mb-8 flex items-center justify-between gap-4">
            <h2 className="text-3xl font-semibold tracking-tight"> {editing ? "My profile" : "About me"} </h2>

            <Button
                    variant="secondary"
                    className="rounded-xl"
                    onClick={() => setEditing(!editing)} >
                   {editing ? "Done" : "Edit"}
            </Button>
          </div>

          <div className="grid items-start gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
            {/* Identity card */}
            <div className="rounded-3xl border border-border bg-card px-6 py-10 text-center shadow-lg shadow-black/5">
              <span className="mx-auto flex size-28 items-center justify-center rounded-full bg-primary/10 text-5xl font-medium text-primary">
                {initial}
              </span>
              <h3 className="mt-5 break-words text-3xl font-semibold"> {name} </h3>
              <p className="mt-1 text-sm text-muted-foreground"> TheEmbassy guest </p>
            </div>

            {editing ? (
              <div className="space-y-5">
                <p className="rounded-xl bg-muted p-3 text-xs leading-5 text-muted-foreground">
                  Profile preview: these fields are not connected
                  to the backend yet. Changes reset when you leave
                  this page.
                </p>

                <div>
                  <label
                    htmlFor="profile-work"
                    className="mb-2 block text-sm font-medium"> My work </label>

                  <Input
                    id="profile-work"
                    placeholder="What do you do?"
                    maxLength={100}
                    value={work}
                    onChange={(event) =>
                      setWork(event.target.value)
                    }
                    className="rounded-xl"/>
                </div>

                <div>
                  <label
                    htmlFor="profile-destination"
                    className="mb-2 block text-sm font-medium"> Where I’d love to go </label>

                  <Input
                    id="profile-destination"
                    placeholder="Your dream destination"
                    maxLength={100}
                    value={destination}
                    onChange={(event) =>
                      setDestination(event.target.value)
                    }
                    className="rounded-xl"/>
                </div>

                <div>
                  <label
                    htmlFor="profile-about"
                    className="mb-2 block text-sm font-medium">About me</label>

                  <textarea
                    id="profile-about"
                    rows={4}
                    maxLength={500}
                    placeholder="Share a little about yourself"
                    value={about}
                    onChange={(event) =>
                      setAbout(event.target.value)}
                    className="w-full rounded-xl border border-input bg-background p-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring"/>
                </div>
              </div>
            ) : (
              <div className="py-3">
                <h3 className="text-2xl font-semibold tracking-tight">Make your profile feel like you</h3>

                <p className="mt-4 text-sm leading-6 text-muted-foreground">
                  Introduce yourself with a few details about
                  your work, travel plans, and interests.
                </p>

                <Button
                  className="mt-6 rounded-xl"
                  onClick={() => setEditing(true)}>Edit profile</Button>
              </div>
            )}
          </div>

          {!editing && (
            <div className="mt-10 grid gap-6 border-t border-border pt-8 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground"> My work</p>
                <p className="mt-2 break-words font-medium"> {work || "Not added yet"}</p>
              </div>

              <div>
                <p className="text-sm text-muted-foreground"> Where I’d love to go</p>
                <p className="mt-2 break-words font-medium">{destination || "Not added yet"}</p>
              </div>

              <div className="sm:col-span-2">
                <p className="text-sm text-muted-foreground">About me</p>
                <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6">
                  {about || "Your introduction will appear here."}
                </p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}

export default ProfilePage