import { prisma } from "../config/prisma.js"

type InitializePaymentInput = {
  bookingId: number
  userId: number
  email: string
}

type PaystackInitializeResponse = {
  status: boolean
  message: string

  data: {
    authorization_url: string
    access_code: string
    reference: string
  }
}

export async function initializePayment(
  input: InitializePaymentInput,
) {
  const {
    bookingId,
    userId,
    email,
  } = input

  // Find the booking and make sure it belongs
  // to the logged-in user.
  const booking =
    await prisma.booking.findFirst({
      where: {
              id: bookingId,
              userId,
           },
         })

  if (!booking) {
    throw new Error("Booking not found.", )
  }

  // Do not pay for a cancelled booking.
  if (booking.status === "CANCELLED") {
    throw new Error("Cancelled bookings cannot be paid.",)
  }

  // Do not pay twice.
  if (booking.status === "CONFIRMED") {
    throw new Error("This booking is already confirmed.",)
  }

  const secretKey = process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    throw new Error("Paystack secret key is missing.",)
  }

  // Paystack expects the amount in the smallest currency unit.
  const amountInCents = Math.round(  Number( booking.totalPrice,) * 100, )

  // Create our own unique reference.
  const reference = `booking_${booking.id}_${Date.now()}`

  const response = await fetch(
    "https://api.paystack.co/transaction/initialize",
    {
      method: "POST",

      headers: {
        Authorization:
          `Bearer ${secretKey}`,

        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        email,
        amount:
          amountInCents.toString(),
        currency: "ZAR",
        reference,

        // For now we only want bank cards.
        channels: ["card"],

        metadata: {
          bookingId:
            booking.id,
          userId,
        },
      }),
    },
  )

  const result =
    (await response.json()) as PaystackInitializeResponse

  if ( !response.ok || !result.status) {
    throw new Error( result.message || "Could not initialize payment.",)
  }

  // Save the payment attempt in Neon.
  await prisma.payment.create({
    data: {
      bookingId:
        booking.id,

      amount:
        booking.totalPrice,

      currency: "ZAR",

      reference:
        result.data.reference,

      status: "PENDING",

      provider: "PAYSTACK",
    },
  })

  return result.data
}