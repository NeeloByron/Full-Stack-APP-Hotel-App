import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function HotelSearch() {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <div className="grid gap-3 lg:grid-cols-6">
        <div className="lg:col-span-2">
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Destination
          </label>

          <Input
            type="text"
            placeholder="Where are you going?"
            className="h-11 rounded-lg border-input bg-background text-foreground placeholder:text-muted-foreground"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Check in
          </label>

          <Input
            type="date"
            className="h-11 rounded-lg border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Check out
          </label>

          <Input
            type="date"
            className="h-11 rounded-lg border-input bg-background text-foreground"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-medium text-muted-foreground">
            Guests
          </label>

          <Select>
            <SelectTrigger className="h-11 w-full rounded-lg border-input bg-background text-foreground">
              <SelectValue placeholder="2 guests" />
            </SelectTrigger>

            <SelectContent className="border-border bg-popover text-popover-foreground">
              <SelectItem value="1">
                1 guest
              </SelectItem>

              <SelectItem value="2">
                2 guests
              </SelectItem>

              <SelectItem value="3">
                3 guests
              </SelectItem>

              <SelectItem value="4">
                4 guests
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end">
          <Button className="h-11 w-full rounded-lg bg-primary text-primary-foreground hover:bg-primary/90">
            Search stays
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HotelSearch