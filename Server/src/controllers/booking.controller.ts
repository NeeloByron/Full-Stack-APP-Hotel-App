import type { Request, Response, } from "express"
import { createBooking } from "../service/booking.service.js"

export async function createBookingController(req: Request, res: Response,) {
  try {
    const {hotelId, roomTypeId, checkIn, checkOut, guests, rooms, } = req.body

    // Basic request validation.
    if (
      !hotelId ||
      !roomTypeId ||
      !checkIn ||
      !checkOut ||
      !guests ||
      !rooms
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide all booking information.",
      })
    }

    const booking = await createBooking({
      hotelId: Number(hotelId),
      roomTypeId: Number(roomTypeId),
      checkIn,
      checkOut,
      guests: Number(guests),
      rooms: Number(rooms),
    })

    return res.status(201).json({
      success: true,
      message:
        "Booking created successfully.",
      data: booking,
    })
  } catch (error) {
    console.error(
      "Create booking error:",
      error,
    )

    const message = error instanceof Error ? error.message : "Could not create booking."

    return res.status(400).json({
      success: false,
      message,
    })
  }
}