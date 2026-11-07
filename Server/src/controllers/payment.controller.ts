import type { Request, Response, } from "express"
import { prisma } from "../config/prisma.js"
import { initializePayment } from "../service/payment.service.js"

// POST /api/payments/initialize - Starts a Paystack payment for one booking.
export async function initializePaymentController( req: Request, res: Response,) {
  try {
    // Auth0 gives us the ID of the logged-in user.
    const auth0Id = req.auth?.payload.sub

    if (!auth0Id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      })
    }

    // Find the logged-in user in our Neon database.
    const user = await prisma.user.findUnique({
        where: {
                auth0Id,
             },
          })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      })
    }

    // Paystack needs an email address.
    if (!user.email) {
      return res.status(400).json({
        success: false,
        message: "Your account does not have an email address.",
      })
    }

    // Booking ID comes from the frontend.
    const bookingId = Number(req.body.bookingId)

    if (!Number.isInteger(bookingId)) {
      return res.status(400).json({
        success: false,
        message: "Invalid booking ID.",
      })
    }

    // Start the payment.
    const payment = await initializePayment({
        bookingId,
        userId: user.id,
        email: user.email,
      })

    return res.status(200).json({
      success: true,
      message: "Payment initialized successfully.",
      data: payment,
    })
  } catch (error) {
    console.error( "Initialize payment error:",  error, )

    return res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Could not initialize payment.",
    })
  }
}