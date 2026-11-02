import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type RoomCardProps = {
  id: string
  name: string
  capacity: number
  price: number
  onSelect: (roomId: string) => void
}

function RoomCard({
  id,
  name,
  capacity,
  price,
  onSelect,
}: RoomCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{name}</CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">
            Up to {capacity} guests
          </p>

          <p className="mt-2 text-sm text-foreground">
            <span className="text-lg font-semibold">
              R{price}
            </span>{" "}
            / night
          </p>
        </div>

        <Button onClick={() => onSelect(id)}>Select room</Button>
      </CardContent>
    </Card>
  )
}

export default RoomCard