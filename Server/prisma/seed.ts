import "dotenv/config"
import { PrismaClient } from "@prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
  adapter,
})

async function main() {
  await (prisma as any).hotel.create({
    data: {
      name: "The Fern House",
      slug: "the-fern-house",
      description:
        "A modern hotel in the heart of Sandton, designed for business travellers and short city stays.",
      address: "24 Rivonia Road, Sandton, Johannesburg",
      city: "Johannesburg",
      province: "Gauteng",
      country: "South Africa",
      starRating: 5,
      guestRating: 4.9,
      latitude: -26.1076,
      longitude: 28.0567,
      mainImage:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
      rooms: {
        create: [
          {
            name: "Standard Room",
            description: "Comfortable room for short stays.",
            capacity: 2,
            quantity: 10,
            price: 1850.0,
            image:
              "https://images.unsplash.com/photo-1564501049412-61c2a3083791?auto=format&fit=crop&w=1000&q=80",
          },
          {
            name: "Deluxe Room",
            description: "A larger room with upgraded amenities.",
            capacity: 2,
            quantity: 6,
            price: 2350.0,
            image:
              "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80",
          },
        ],
      },
    },
  })

  console.log("Hotel seed completed")
}

main()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })