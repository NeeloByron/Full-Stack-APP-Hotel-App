import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, } from "@/components/ui/card"

type HotelCardProps = {
  name: string
  location: string
  price: number
  rating: number
  image: string
  tag?: string
}

function HotelCard({
  name,
  location,
  price,
  rating,
  image,
  tag,
}: HotelCardProps) {
  return (
    <Card className="overflow-hidden border-border bg-card p-0">
      <div className="relative">
        <img
             src={image}
             alt={name}
             className="aspect-[4/3] w-full object-cover" />

        {tag && (
          <Badge className="absolute left-3 top-3 bg-card text-foreground">{tag}</Badge>
         )}
        </div>

      <CardContent className="space-y-3 p-5">
        <div>
            <p className="text-sm text-muted-foreground"> {location} </p>
            <h3 className="mt-1 text-lg font-medium text-foreground"> {name} </h3>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground"> ★ {rating} </p>

          <p className="text-sm text-foreground">
            <span className="font-semibold"> R{price} </span>{" "}
            / night
          </p>
        </div>
      </CardContent>

      <CardFooter className="p-5 pt-0">
        <Button variant="outline" className="w-full"> View hotel </Button>
      </CardFooter>
    </Card>
  )
}

export default HotelCard