import { Router } from "express"
import { createBookingController, } from "../controllers/booking.controller.js"
import { validateAccessToken } from "../middleware/auth0.middleware.js"
const router = Router()

// POST /api/bookings
router.post( "/", validateAccessToken, createBookingController, )

export default router