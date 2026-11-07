import { Router } from "express"
import { createBookingController, getMyBookingsController } from "../controllers/booking.controller.js"
import { validateAccessToken } from "../middleware/auth0.middleware.js"
const router = Router()

// POST /api/bookings - create booking
router.post( "/", validateAccessToken, createBookingController, )

// GET /api/me - get booking belonging to logged-in user
router.get("/me", validateAccessToken, getMyBookingsController)

export default router