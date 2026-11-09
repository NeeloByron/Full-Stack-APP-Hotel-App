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

        country: z
          .string()
          .trim()
          .min(2)
          .default("South Africa"),

        starRating: z.number().int().min(1).max(5),

        mainImage: z
          .string()
          .url()
          .max(2000)
          .refine(
            (url) => url.startsWith("https://"),
            "The photo must use an HTTPS URL."
          ),

        latitude: z
          .number()
          .min(-90)
          .max(90)
          .nullable()
          .default(null),

        longitude: z
          .number()
          .min(-180)
          .max(180)
          .nullable()
          .default(null),
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

// PATCH /api/hotels/:id ADMIN can edit hotel information.
router.patch("/:id", validateAccessToken, requireAdmin,
async (req, res) => {
    const hotelId =
      Number(req.params.id)

    if (!Number.isInteger(hotelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID.",
      })
    }

    const updateHotelSchema = z
      .object({
        name: z
          .string()
          .trim()
          .min(2)
          .max(120)
          .optional(),

        description: z
          .string()
          .trim()
          .min(10)
          .max(5000)
          .optional(),

        address: z
          .string()
          .trim()
          .min(3)
          .max(300)
          .optional(),

        city: z
          .string()
          .trim()
          .min(2)
          .max(100)
          .optional(),

        province: z
          .string()
          .trim()
          .min(2)
          .max(100)
          .optional(),

        country: z
          .string()
          .trim()
          .min(2)
          .optional(),

        starRating: z
          .number()
          .int()
          .min(1)
          .max(5)
          .optional(),

        mainImage: z
          .string()
          .url()
          .max(2000)
          .refine(
            (url) =>
              url.startsWith(
                "https://",
              ),
            "The photo must use an HTTPS URL.",
          )
          .optional(),

        latitude: z
          .number()
          .min(-90)
          .max(90)
          .nullable()
          .optional(),

        longitude: z
          .number()
          .min(-180)
          .max(180)
          .nullable()
          .optional(),
      })
      .strict()

    const result =
      updateHotelSchema.safeParse(
        req.body,
      )

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          result.error.issues[0]
            ?.message ??
          "Please check the hotel information.",
      })
    }

    try {
      // Make sure the hotel exists first.
      const existingHotel =
        await prisma.hotel.findUnique({
          where: {
            id: hotelId,
          },
        })

      if (!existingHotel) {
        return res.status(404).json({
          success: false,
          message:
            "Hotel not found.",
        })
      }

      // Work out what the final coordinates
      // will be after this edit.
      const latitude =
        result.data.latitude !==
        undefined
          ? result.data.latitude
          : existingHotel.latitude

      const longitude =
        result.data.longitude !==
        undefined
          ? result.data.longitude
          : existingHotel.longitude

      // They must either both exist,
      // or both be empty.
      if (
        (latitude === null) !==
        (longitude === null)
      ) {
        return res.status(400).json({
          success: false,
          message:
            "Provide both coordinates, or leave both empty.",
        })
      }

      const hotel =
        await prisma.hotel.update({
          where: {
            id: hotelId,
          },

          data: result.data,
        })

      return res.status(200).json({
        success: true,
        message: "Hotel updated successfully.",
        data: hotel,
      })
    } catch (error) {
      console.error("Update hotel failed:",
        error,
      )

      return res.status(500).json({
        success: false,
        message: "Could not update the hotel.",
      })
    }
  },
)

// PATCH /api/hotels/:id/publish
// ADMIN decides whether a hotel is public.
router.patch(
  "/:id/publish",
  validateAccessToken,
  requireAdmin,
  async (req, res) => {
    const hotelId =
      Number(req.params.id)

    if (!Number.isInteger(hotelId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid hotel ID.",
      })
    }

    const publishSchema = z.object({
      active: z.boolean(),
    })

    const result =
      publishSchema.safeParse(
        req.body,
      )

    if (!result.success) {
      return res.status(400).json({
        success: false,
        message:
          "active must be true or false.",
      })
    }

    try {
      const existingHotel =
        await prisma.hotel.findUnique({
          where: {
            id: hotelId,
          },

          include: {
            rooms: true,
          },
        })

      if (!existingHotel) {
        return res.status(404).json({
          success: false,
          message:
            "Hotel not found.",
        })
      }

      // Don't publish a hotel that
      // has no rooms yet.
      if (
        result.data.active &&
        existingHotel.rooms.length === 0
      ) {
        return res.status(400).json({
          success: false,
          message: "Add at least one room before publishing this hotel.",
        })
      }

      const hotel =
        await prisma.hotel.update({
          where: {
            id: hotelId,
          },

          data: {
            active:
              result.data.active,
          },
        })

      return res.status(200).json({
        success: true,

        message: hotel.active
          ? "Hotel published successfully."
          : "Hotel unpublished successfully.",

        data: hotel,
      })
    } catch (error) {
      console.error(
        "Publish hotel failed:",
        error,
      )

      return res.status(500).json({
        success: false,
        message: "Could not update hotel publishing status.",
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