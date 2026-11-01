import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

type HotelFiltersProps = {
  priceFilters: string[]
  ratingFilters: number[]
  onPriceChange: (value: string) => void
  onRatingChange: (value: number) => void
}

function HotelFilters({
  priceFilters,
  ratingFilters,
  onPriceChange,
  onRatingChange,
}: HotelFiltersProps) {
  return (
    <aside className="space-y-6">
      <div>
        <h2 className="text-sm font-semibold text-foreground">Filters</h2>

        <p className="mt-1 text-sm text-muted-foreground"> Narrow down your search.</p>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground"> Price per night</h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={priceFilters.includes("under-1500")}
              onCheckedChange={() => onPriceChange("under-1500")}/>
            Under R1,500
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={priceFilters.includes("1500-2500")}
              onCheckedChange={() => onPriceChange("1500-2500")} />
            R1,500 - R2,500
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={priceFilters.includes("2500-plus")}
              onCheckedChange={() => onPriceChange("2500-plus")} />
            R2,500+
          </label>
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="mb-4 text-sm font-medium text-foreground"> Guest rating </h3>

        <div className="space-y-3">
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={ratingFilters.includes(4.8)}
              onCheckedChange={() => onRatingChange(4.8)} />
            4.8+
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={ratingFilters.includes(4.5)}
              onCheckedChange={() => onRatingChange(4.5)} />
            4.5+
          </label>

          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <Checkbox
              checked={ratingFilters.includes(4)}
              onCheckedChange={() => onRatingChange(4)} />
            4.0+
          </label>
        </div>
      </div>
    </aside>
  )
}

export default HotelFilters