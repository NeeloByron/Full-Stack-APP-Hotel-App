import { prisma } from "../config/prisma.js"

type CreateBookingInput = {
  userId: number
  hotelId: number
  roomTypeId: number
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

export async function createBooking(input: CreateBookingInput) {
  const { userId, hotelId, roomTypeId, checkIn, checkOut, guests, rooms,} = input

  const checkInDate = new Date(checkIn)
  const checkOutDate = new Date(checkOut)

  // 1. Validate the dates
  if (
    Number.isNaN(checkInDate.getTime()) ||
    Number.isNaN(checkOutDate.getTime())
  ) {
    throw new Error("Invalid booking dates.")
  }

  if (checkOutDate <= checkInDate) {
    throw new Error(
      "Check-out date must be after check-in date.",
    )
  }

  // 2. Validate guests and rooms
  if (!Number.isInteger(guests) || guests < 1) {
    throw new Error(
      "Number of guests must be at least 1.",
    )
  }

  if (!Number.isInteger(rooms) || rooms < 1) {
    throw new Error(
      "Number of rooms must be at least 1.",
    )
  }

  // 3. Find the selected room type
  const roomType = await prisma.roomType.findUnique({
    where: {
      id: roomTypeId,
    },

    include: {
      hotel: true,
    },
  })

  if (!roomType) {
    throw new Error("Room type not found.")
  }

  // Makes sure the room belongs to the hotel sent by the frontend.
  if (roomType.hotelId !== hotelId) {
    throw new Error(
      "This room does not belong to the selected hotel.",
    )
  }

  // 4. Check room capacity

  const maximumGuests =
    roomType.capacity * rooms

  if (guests > maximumGuests) {
    throw new Error(
      `These rooms can accommodate a maximum of ${maximumGuests} guests.`,
    )
  }

  if (rooms > roomType.quantity) {
    throw new Error(
      "You selected more rooms than this hotel has available.",
    )
  }

  // 5. Find overlapping bookings
  const overlappingBookings =
    await prisma.booking.findMany({
      where: {
        roomTypeId,

        status: {
          in: ["PENDING", "CONFIRMED"],
        },

        // Two bookings overlap when: existing check-in < new check-out AND existing check-out > new check-in
        checkIn: {
          lt: checkOutDate,
        },

        checkOut: {
          gt: checkInDate,
        },
      },

      select: {
        rooms: true,
      },
    })

  // Count how many rooms are already reserved.
 const alreadyBookedRooms = overlappingBookings.reduce(
   (
     total: number,
     booking: (typeof overlappingBookings)[number],
   ) => total + booking.rooms,
   0,
 )

  const availableRooms =
    roomType.quantity - alreadyBookedRooms

  if (rooms > availableRooms) {
    throw new Error(
      `Only ${availableRooms} room(s) are available for those dates.`,
    )
  }

  // 6. Calculate number of nights
  const millisecondsPerDay =
    1000 * 60 * 60 * 24

  const nights = Math.ceil(
    (checkOutDate.getTime() -
      checkInDate.getTime()) /
      millisecondsPerDay,
  )

  // Prisma Decimal often arrives as something convertible to a number.
  const nightlyPrice =
    Number(roomType.price)

  // Backend calculates the price. Never trust total price from frontend.
  const totalPrice =
    nightlyPrice * nights * rooms

  // 7. Save booking to PostgreSQL
  const booking =
    await prisma.booking.create({
      data: {
        userId,
        hotelId,
        roomTypeId,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        guests,
        rooms,
        nightlyPrice,
        totalPrice,
        status: "PENDING",
      },

      include: {
        user: true,
        hotel: true,
        roomType: true,
      },
    })

  return booking
}