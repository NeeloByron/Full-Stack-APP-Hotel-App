import { Router } from "express"
import { createBookingController, getMyBookingsController, cancelBookingController } from "../controllers/booking.controller.js"
import { validateAccessToken } from "../middleware/auth0.middleware.js"

const router = Router()

// POST /api/bookings - create booking
router.post( "/", validateAccessToken, createBookingController, )

// GET /api/me - get booking belonging to logged-in user
router.get("/me", validateAccessToken, getMyBookingsController)

// Patch /api/cancel - cancel boooking beloning to a logged-in user
router.patch("/:id/cancel", validateAccessToken, cancelBookingController)

export default router