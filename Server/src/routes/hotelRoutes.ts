import { Router } from "express"
import { prisma } from "../config/prisma.js"
import { validateAccessToken } from "../middleware/auth0.middleware.js"
import { requireAdmin } from "../middleware/admin.middleware.js"
import { z } from "zod"
import { randomUUID } from "node:crypto"

const router = Router()
// POST /api/hotels - Only an admin can create a hotel.
router.post( "/", validateAccessToken, requireAdmin,
  async (req, res) => {
    const hotelSchema = z
      .object({
        name: z.string().trim().min(2).max(120),
        description: z.string().trim().min(10).max(5000),
        address: z.string().trim().min(3).max(300),
        city: z.string().trim().min(2).max(100),
        province: z.string().trim().min(2).max(100),

        country: z.string().trim().min(2).default("South Africa"),
        starRating: z.number().int().min(1).max(5),
        mainImage: z.string().url().max(2000)
          .refine(
            (url) => url.startsWith("https://"),
            "The photo must use an HTTPS URL."
          ),

        latitude: z.number().min(-90).max(90).nullable().default(null),
        longitude: z.number().min(-180).max(180).nullable().default(null),
      })
      .strict()
      .refine(
        (hotel) =>
          (hotel.latitude === null) ===
          (hotel.longitude === null),
        "Provide both coordinates, or leave both empty."
      )

    // Check the information before saving it.
    const result = hotelSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          result.error.issues[0]?.message ??
          "Please check the hotel information.",
      })
    }

    try {
      // Turn the name into a URL-friendly slug.
      const nameSlug = result.data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")

      const hotel = await prisma.hotel.create({
        data: {
          ...result.data,

          slug: `${nameSlug || "hotel"}-${randomUUID()}`,

          // Keep it hidden until rooms are added and it is published.
          active: false,
        },
      })

      return res.status(201).json({
        success: true,
        message: "Hotel saved as a draft.",
        data: hotel,
      })
    } catch (error) {
      console.error("Create hotel failed:", error)

      return res.status(500).json({
        success: false,
        message: "Could not create the hotel. Please try again.",
      })
    }
  }
)

// POST /api/hotels/:id/rooms Add a room type to an existing hotel.
router.post("/:id/rooms",validateAccessToken,requireAdmin,
  async (req, res) => {
    const hotelId = Number(req.params.id)

    if (!Number.isSafeInteger(hotelId) || hotelId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID.",
      })
    }

    const roomSchema = z
      .object({
        name: z.string().trim().min(2).max(120),
        description: z.string().trim().max(3000).default(""),
        capacity: z.number().int().min(1).max(100),
        quantity: z.number().int().min(1).max(10000),
        price: z.number().positive().max(1000000).refine(
            (value) => value === Number(value.toFixed(2)),
            "Price can have at most two decimal places."),

        image: z.string().url().max(2000)
          .refine(
            (url) => url.startsWith("https://"),
            "The photo must use an HTTPS URL."
          )
          .nullable()
          .default(null),
      })
      .strict()

    const result = roomSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          result.error.issues[0]?.message ??
          "Please check the room information.",
      })
    }

    try {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
      })

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found.",
        })
      }

      const room = await prisma.roomType.create({
        data: {...result.data,hotelId,},
      })

      return res.status(201).json({
        success: true,
        message: "Room type added successfully.",
        data: room,
      })
    } catch (error) {
      console.error("Create room failed:", error)

      return res.status(500).json({
        success: false,
        message: "Could not add the room. Please try again.",
      })
    }
  }
)

// PATCH /api/hotels/:id/publish Admins can publish or unpublish a hotel.
router.patch("/:id/publish",validateAccessToken,requireAdmin,
  async (req, res) => {
    const hotelId = Number(req.params.id)

    if (!Number.isSafeInteger(hotelId) || hotelId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID.",
      })
    }

    const result = z
      .object({
        active: z.boolean(),
      })
      .strict()
      .safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message: "Provide active as true or false.",
      })
    }

    try {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
        include: { rooms: true },
      })

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found.",
        })
      }

      const hasBookableRoom = hotel.rooms.some(
        (room) =>
          room.quantity > 0 &&
          room.capacity > 0 &&
          Number(room.price) > 0
      )

      if (result.data.active && !hasBookableRoom) {
        return res.status(400).json({
          success: false,
          message: "Add a room with a price and quantity before publishing.",
        })
      }

      const updatedHotel = await prisma.hotel.update({
        where: { id: hotelId },
        data: {
          active: result.data.active,
        },
      })

      return res.status(200).json({
        success: true,
        message: updatedHotel.active
          ? "Hotel published successfully."
          : "Hotel unpublished successfully.",
        data: updatedHotel,
      })
    } catch (error) {
      console.error("Publish hotel failed:", error)

      return res.status(500).json({
        success: false,
        message: "Could not update publishing status.",
      })
    }
  }
)

// PATCH /api/hotels/:id Update only the hotel details included in the request.
router.patch("/:id",validateAccessToken,requireAdmin,
  async (req, res) => {
    const hotelId = Number(req.params.id)

    if (!Number.isSafeInteger(hotelId) || hotelId < 1) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID.",
      })
    }

    const updateSchema = z
      .object({
        name: z.string().trim().min(2).max(120),
        description: z.string().trim().min(10).max(5000),
        address: z.string().trim().min(3).max(300),
        city: z.string().trim().min(2).max(100),
        province: z.string().trim().min(2).max(100),
        country: z.string().trim().min(2).max(100),
        starRating: z.number().int().min(1).max(5),

        mainImage: z.string().url().max(2000)
          .refine(
            (url) => url.startsWith("https://"),
            "The photo must use an HTTPS URL."
          ),

        latitude: z.number().min(-90).max(90).nullable(),
        longitude: z.number().min(-180).max(180).nullable(),
      })
      .partial()
      .strict()
      .refine(
        (details) => Object.keys(details).length > 0,
        "Provide at least one detail to update."
      )

    const result = updateSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          result.error.issues[0]?.message ??
          "Please check the hotel information.",
      })
    }

    try {
      const hotel = await prisma.hotel.findUnique({
        where: { id: hotelId },
      })

      if (!hotel) {
        return res.status(404).json({
          success: false,
          message: "Hotel not found.",
        })
      }

      // Check the resulting coordinates, including existing values.
      const latitude =
        result.data.latitude === undefined
          ? hotel.latitude
          : result.data.latitude

      const longitude =
        result.data.longitude === undefined
          ? hotel.longitude
          : result.data.longitude

      if ((latitude === null) !== (longitude === null)) {
        return res.status(400).json({
          success: false,
          message: "Provide both coordinates, or set both to null.",
        })
      }

      const updatedHotel = await prisma.hotel.update({
        where: { id: hotelId },
        data: result.data,
      })

      return res.status(200).json({
        success: true,
        message: "Hotel updated successfully.",
        data: updatedHotel,
      })
    } catch (error) {
      console.error("Update hotel failed:", error)

      return res.status(500).json({
        success: false,
        message: "Could not update the hotel. Please try again.",
      })
    }
  }
)

// PATCH /api/hotels/:hotelId/rooms/:roomId
// Admins can edit room details and pricing.
router.patch("/:hotelId/rooms/:roomId",validateAccessToken,requireAdmin,
  async (req, res) => {
    const hotelId = Number(req.params.hotelId)
    const roomId = Number(req.params.roomId)

    if (
      !Number.isSafeInteger(hotelId) ||
      hotelId < 1 ||
      !Number.isSafeInteger(roomId) ||
      roomId < 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel or room ID.",
      })
    }

    const updateSchema = z
      .object({
        name: z.string().trim().min(2).max(120),

        description: z.string().trim().max(3000),

        price: z.number().positive().max(1000000)
          .refine(
            (value) => value === Number(value.toFixed(2)),
            "Price can have at most two decimal places."
          ),

        image: z.string().url().max(2000)
          .refine(
            (url) => url.startsWith("https://"),
            "The photo must use an HTTPS URL."
          )
          .nullable(),
      })
      .partial()
      .strict()
      .refine(
        (details) => Object.keys(details).length > 0,
        "Provide at least one room detail to update."
      )

    const result = updateSchema.safeParse(req.body)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          result.error.issues[0]?.message ??
          "Please check the room information.",
      })
    }

    try {
      // Check that this room belongs to the selected hotel.
      const room = await prisma.roomType.findFirst({
        where: {
          id: roomId,
          hotelId,
        },
      })

      if (!room) {
        return res.status(404).json({
          success: false,
          message: "Room not found in this hotel.",
        })
      }

      const updatedRoom = await prisma.roomType.update({
        where: { id: room.id },
        data: result.data,
      })

      return res.status(200).json({
        success: true,
        message: "Room updated successfully.",
        data: updatedRoom,
      })
    } catch (error) {
      console.error("Update room failed:", error)

      return res.status(500).json({
        success: false,
        message: "Could not update the room. Please try again.",
      })
    }
  }
)

// GET /api/hotels, Returns all active hotels
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

// GET /api/hotels/admin/all ADMIN can see published and draft hotels. 
  router.get( "/admin/all", validateAccessToken, requireAdmin,
  async (_req, res) => {
    try {
      const hotels =
        await prisma.hotel.findMany({
          include: {
            rooms: true,
          },

          orderBy: {
            createdAt: "desc",
          },
        })

      return res.status(200).json({
        success: true,
        data: hotels,
      })
    } catch (error) {
      console.error(
        "Get admin hotels failed:",
        error,
      )

      return res.status(500).json({
        success: false,
        message: "Could not load hotels.",
      })
    }
  },
)

// Temporary route used to test ADMIN authorization.
router.get("/admin-check", validateAccessToken, requireAdmin, (_req, res) => {
    return res.status(200).json({
                                  success: true,
                                  message: "Admin access granted.",
                               })
                            },
                          ) 

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

    if (!hotel || !hotel.active) {
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