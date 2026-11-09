import { useEffect, useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

type Hotel = {
  id: number
  name: string
  slug: string
  description: string
  address: string
  city: string
  province: string
  country: string
  starRating: number
  mainImage: string
  latitude: number | null
  longitude: number | null
  active: boolean
}

type HotelForm = {
  name: string
  description: string
  address: string
  city: string
  province: string
  country: string
  starRating: string
  mainImage: string
  latitude: string
  longitude: string
}

const emptyForm: HotelForm = {
  name: "",
  description: "",
  address: "",
  city: "",
  province: "",
  country: "South Africa",
  starRating: "4",
  mainImage: "",
  latitude: "",
  longitude: "",
}

function AdminListingsPage() {
  const {
    isAuthenticated,
    isLoading: authLoading,
    loginWithRedirect,
    getAccessTokenSilently,
  } = useAuth0()

  const [hotels, setHotels] = useState<Hotel[]>([])
  const [form, setForm] = useState<HotelForm>(emptyForm)

  const [editingId, setEditingId] =
    useState<number | null>(null)

  const [loading, setLoading] =
    useState(true)

  const [saving, setSaving] =
    useState(false)

  const [error, setError] =
    useState("")

  const [message, setMessage] =
    useState("")

  // ------------------------------------------------
  // Load every hotel, including drafts.
  // ------------------------------------------------
  async function loadHotels() {
    try {
      setLoading(true)
      setError("")

      const token =
        await getAccessTokenSilently()

      const response = await fetch(
        "/api/hotels/admin/all",
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        },
      )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Could not load hotels.",
        )
      }

      setHotels(result.data)
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not load hotels.",
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadHotels()
    }
  }, [isAuthenticated])

  // ------------------------------------------------
  // Update form fields.
  // ------------------------------------------------
  function handleChange(
    event:
      | React.ChangeEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement>,
  ) {
    const { name, value } =
      event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // ------------------------------------------------
  // Prepare the data before sending it.
  // ------------------------------------------------
  function createPayload() {
    const latitude =
      form.latitude.trim() === ""
        ? null
        : Number(form.latitude)

    const longitude =
      form.longitude.trim() === ""
        ? null
        : Number(form.longitude)

    return {
      name: form.name,
      description:
        form.description,
      address: form.address,
      city: form.city,
      province: form.province,
      country: form.country,
      starRating:
        Number(form.starRating),
      mainImage: form.mainImage,
      latitude,
      longitude,
    }
  }

  // ------------------------------------------------
  // Create a hotel OR save edits.
  // ------------------------------------------------
  async function handleSubmit(
    event:
      React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault()

    try {
      setSaving(true)
      setError("")
      setMessage("")

      const token =
        await getAccessTokenSilently()

      const isEditing =
        editingId !== null

      const url = isEditing
        ? `/api/hotels/${editingId}`
        : "/api/hotels"

      const method = isEditing
        ? "PATCH"
        : "POST"

      const response = await fetch(
        url,
        {
          method,

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify(
            createPayload(),
          ),
        },
      )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Could not save hotel.",
        )
      }

      setMessage(
        isEditing
          ? "Hotel updated successfully."
          : "Hotel created as a draft.",
      )

      setForm(emptyForm)
      setEditingId(null)

      await loadHotels()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not save hotel.",
      )
    } finally {
      setSaving(false)
    }
  }

  // ------------------------------------------------
  // Put an existing hotel into the form.
  // ------------------------------------------------
  function startEditing(
    hotel: Hotel,
  ) {
    setEditingId(hotel.id)

    setForm({
      name: hotel.name,
      description:
        hotel.description,
      address: hotel.address,
      city: hotel.city,
      province: hotel.province,
      country: hotel.country,
      starRating:
        String(hotel.starRating),
      mainImage:
        hotel.mainImage,

      latitude:
        hotel.latitude === null
          ? ""
          : String(hotel.latitude),

      longitude:
        hotel.longitude === null
          ? ""
          : String(hotel.longitude),
    })

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  // ------------------------------------------------
  // Cancel editing.
  // ------------------------------------------------
  function cancelEditing() {
    setEditingId(null)
    setForm(emptyForm)
    setError("")
    setMessage("")
  }

  // ------------------------------------------------
  // Publish or unpublish a hotel.
  // ------------------------------------------------
  async function changePublishStatus(
    hotel: Hotel,
  ) {
    try {
      setError("")
      setMessage("")

      const token =
        await getAccessTokenSilently()

      const response = await fetch(
        `/api/hotels/${hotel.id}/publish`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            active: !hotel.active,
          }),
        },
      )

      const result =
        await response.json()

      if (!response.ok) {
        throw new Error(
          result.message ??
            "Could not update hotel.",
        )
      }

      setMessage(result.message)

      await loadHotels()
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Could not update hotel.",
      )
    }
  }

  // ------------------------------------------------
  // Auth loading
  // ------------------------------------------------
  if (authLoading) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-16">
        <p>Loading...</p>
      </main>
    )
  }

  // ------------------------------------------------
  // User must log in first.
  // ------------------------------------------------
  if (!isAuthenticated) {
    return (
      <main className="mx-auto max-w-7xl px-6 py-20 text-center">
        <h1 className="text-3xl font-semibold">
          Admin hotel management
        </h1>

        <p className="mt-3 text-muted-foreground">
          Log in with your admin account
          to manage hotels.
        </p>

        <Button
          className="mt-6 rounded-full"
          onClick={() =>
            loginWithRedirect({
              appState: {
                returnTo:
                  "/hosting/listings",
              },
            })
          }
        >
          Log in
        </Button>
      </main>
    )
  }

  return (
    <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
      {/* Page heading */}
      <div className="mb-10">
        <p className="text-sm font-medium text-primary">
          TheEmbassy Admin
        </p>

        <h1 className="mt-2 text-4xl font-semibold tracking-tight">
          Hotel management
        </h1>

        <p className="mt-3 max-w-2xl text-muted-foreground">
          Create properties, edit
          hotel information and control
          which listings are visible to
          guests.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Success */}
      {message && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
          {message}
        </div>
      )}

      {/* ----------------------------------------- */}
      {/* CREATE / EDIT FORM */}
      {/* ----------------------------------------- */}

      <section className="rounded-3xl border bg-background p-6 shadow-sm sm:p-8">
        <div className="mb-8">
          <h2 className="text-2xl font-semibold">
            {editingId
              ? "Edit hotel"
              : "Create a hotel"}
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            New hotels are saved as
            drafts until you publish
            them.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Hotel name
              </label>

              <Input
                required
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="The Embassy Sandton"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Star rating
              </label>

              <Input
                required
                name="starRating"
                type="number"
                min="1"
                max="5"
                value={
                  form.starRating
                }
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Description
            </label>

            <textarea
              required
              name="description"
              value={
                form.description
              }
              onChange={handleChange}
              rows={5}
              placeholder="Describe the hotel..."
              className="w-full rounded-xl border bg-background px-3 py-3 text-sm outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Address
            </label>

            <Input
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="1 Example Street"
            />
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium">
                City
              </label>

              <Input
                required
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Sandton"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Province
              </label>

              <Input
                required
                name="province"
                value={
                  form.province
                }
                onChange={handleChange}
                placeholder="Gauteng"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Country
              </label>

              <Input
                required
                name="country"
                value={form.country}
                onChange={handleChange}
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Main image URL
            </label>

            <Input
              required
              name="mainImage"
              type="url"
              value={
                form.mainImage
              }
              onChange={handleChange}
              placeholder="https://..."
            />

            {form.mainImage && (
              <img
                src={form.mainImage}
                alt="Hotel preview"
                className="mt-4 h-52 w-full rounded-2xl object-cover md:w-96"
              />
            )}
          </div>

          {/* Map */}
          <div>
            <h3 className="font-semibold">
              Map coordinates
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              Add both latitude and
              longitude, or leave both
              empty.
            </p>

            <div className="mt-4 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Latitude
                </label>

                <Input
                  name="latitude"
                  type="number"
                  step="any"
                  value={
                    form.latitude
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="-26.1076"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
                  Longitude
                </label>

                <Input
                  name="longitude"
                  type="number"
                  step="any"
                  value={
                    form.longitude
                  }
                  onChange={
                    handleChange
                  }
                  placeholder="28.0567"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button
              type="submit"
              disabled={saving}
              className="rounded-full px-7"
            >
              {saving
                ? "Saving..."
                : editingId
                  ? "Save changes"
                  : "Create hotel"}
            </Button>

            {editingId && (
              <Button
                type="button"
                variant="outline"
                className="rounded-full"
                onClick={
                  cancelEditing
                }
              >
                Cancel editing
              </Button>
            )}
          </div>
        </form>
      </section>

      {/* ----------------------------------------- */}
      {/* HOTEL LIST */}
      {/* ----------------------------------------- */}

      <section className="mt-12">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-semibold">
              Your hotels
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Draft and published
              properties.
            </p>
          </div>

          <span className="rounded-full bg-muted px-4 py-2 text-sm">
            {hotels.length} hotels
          </span>
        </div>

        {loading ? (
          <p className="py-12 text-center text-muted-foreground">
            Loading hotels...
          </p>
        ) : hotels.length === 0 ? (
          <div className="rounded-3xl border border-dashed p-12 text-center">
            <h3 className="text-xl font-semibold">
              No hotels yet
            </h3>

            <p className="mt-2 text-sm text-muted-foreground">
              Create your first
              property above.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {hotels.map(
              (hotel) => (
                <article
                  key={hotel.id}
                  className="overflow-hidden rounded-3xl border bg-background"
                >
                  <img
                    src={
                      hotel.mainImage
                    }
                    alt={hotel.name}
                    className="h-56 w-full object-cover"
                  />

                  <div className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold">
                          {hotel.name}
                        </h3>

                        <p className="mt-1 text-sm text-muted-foreground">
                          {hotel.city},{" "}
                          {
                            hotel.province
                          }
                        </p>
                      </div>

                      <span
                        className={
                          hotel.active
                            ? "rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700"
                            : "rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {hotel.active
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>

                    <p className="mt-4 line-clamp-2 text-sm leading-6 text-muted-foreground">
                      {
                        hotel.description
                      }
                    </p>

                    {hotel.latitude !==
                      null &&
                      hotel.longitude !==
                        null && (
                        <p className="mt-4 text-xs text-muted-foreground">
                          Coordinates:{" "}
                          {
                            hotel.latitude
                          }
                          ,{" "}
                          {
                            hotel.longitude
                          }
                        </p>
                      )}

                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button
                        variant="outline"
                        className="rounded-full"
                        onClick={() =>
                          startEditing(
                            hotel,
                          )
                        }
                      >
                        Edit
                      </Button>

                      <Button
                        className="rounded-full"
                        variant={
                          hotel.active
                            ? "secondary"
                            : "default"
                        }
                        onClick={() =>
                          changePublishStatus(
                            hotel,
                          )
                        }
                      >
                        {hotel.active
                          ? "Unpublish"
                          : "Publish"}
                      </Button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        )}
      </section>
    </main>
  )
}

export default AdminListingsPage