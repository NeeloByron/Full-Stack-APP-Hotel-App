import type { Request, Response, } from "express"
import { createBooking, getBookingsForUser } from "../service/booking.service.js"
import { syncAuthUser } from "../service/user.service.js"

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
        message: "Please provide all booking information.",
      })
    }

    const auth0Id = req.auth?.payload.sub
     if (!auth0Id) {
                     return res.status(401).json({
                     success: false,
                     message: "Authentication required.",
                    })
                   }

    const email = typeof req.auth?.payload.email === "string" ? req.auth.payload.email : undefined
    const name = typeof req.auth?.payload.name === "string" ? req.auth.payload.name : undefined

    const user = await syncAuthUser({
      auth0Id,
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    })

    const booking = await createBooking({
      userId: user.id,
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
    console.error("Create booking error:", error, )

    const message = error instanceof Error ? error.message : "Could not create booking."

    return res.status(400).json({
      success: false,
      message,
    })
  }
}

export async function getMyBookingsController(
  req: Request,
  res: Response,
) {
  try {
    // Auth0 puts the logged-in user's unique ID in "sub".
    const auth0Id = req.auth?.payload.sub

    if (!auth0Id) {
      return res.status(401).json({
                                    success: false,
                                    message: "Authentication required.",
                               })
                             }

    const bookings = await getBookingsForUser(auth0Id)

    return res.status(200).json({
                                  success: true,
                                  data: bookings,
                               })
    } catch (error) {
    console.error( "Get my bookings error:", error, )

    return res.status(500).json({
                                  success: false,
                                  message: "Could not load bookings.",
                             })
                            }
                          }