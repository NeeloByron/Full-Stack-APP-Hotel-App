import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

function HotelFilters() {
  return (
    <aside className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>
        <p className="mt-1 text-sm text-muted-foreground">Narrow down your search.</p>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground">
          Price per night
        </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-muted-foreground"><Checkbox />
            Under R1,500
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox />
            R1,500 - R2,500
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox />
            R2,500+
          </label>
        </div>
      </div>

      <Separator />

      <div>
       <h3 className="mb-4 text-sm font-medium text-foreground">Star rating</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox />
            5 stars
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox />
            4 stars
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox />
            3 stars
          </label>
        </div>
      </div>
    </aside>
  )
}

export default HotelFilters