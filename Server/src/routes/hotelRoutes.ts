import { Router } from "express"
import { prisma } from "../config/prisma.js"

const router = Router()

// GET /api/hotels
// Returns all active hotels
router.get("/", async (_req, res) => {
  try {
    const hotels = await prisma.hotel.findMany({
      where: {
        active: true,
      },

      include: {
        rooms: true,
      },

      orderBy: {
        createdAt: "desc",
      },
    })

    res.status(200).json({
      success: true,
      data: hotels,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch hotels",
    })
  }
})

// GET /api/hotels/:slug
// Returns one hotel
router.get("/:slug", async (req, res) => {
  try {
    const { slug } = req.params

    const hotel = await prisma.hotel.findUnique({
      where: {
        slug,
      },

      include: {
        rooms: true,
      },
    })

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: "Hotel not found",
      })
    }

    res.status(200).json({
      success: true,
      data: hotel,
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      success: false,
      message: "Failed to fetch hotel",
    })
  }
})

export default router