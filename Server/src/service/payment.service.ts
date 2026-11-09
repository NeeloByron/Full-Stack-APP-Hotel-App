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

type PaystackVerifyResponse = {
  status: boolean
  message: string

  data: {
    status: string
    reference: string | string[]
    amount: number
    currency: string
  }
}

export async function initializePayment(input: InitializePaymentInput,) {
  const { bookingId, userId, email, } = input

  // Find the booking and make sure it belongs to the logged-in user.
  const booking = await prisma.booking.findFirst({
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

    // Only allow bank card payments for now.
    channels: ["card"],

    // After payment Paystack sends the user
    // back to our React application.
    callback_url: "https://full-stack-app-hotel-app-lac.vercel.app/payment/callback",

     metadata: {
       bookingId:
        booking.id,

        userId,
        },
      }),
    },
  )

  const result = (await response.json()) as PaystackInitializeResponse

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

export async function verifyPayment(
  reference: string,
) {
  const secretKey =
    process.env.PAYSTACK_SECRET_KEY

  if (!secretKey) {
    throw new Error(
      "Paystack secret key is missing.",
    )
  }

  // Find the payment in our database.
  const payment =
    await prisma.payment.findUnique({
      where: {
        reference,
      },

      include: {
        booking: true,
      },
    })

  if (!payment) {
    throw new Error(
      "Payment record not found.",
    )
  }

  // IMPORTANT:
  // Never turn a cancelled booking
  // back into CONFIRMED.
  if (
    payment.booking.status ===
    "CANCELLED"
  ) {
    throw new Error(
      "This booking has been cancelled and cannot be confirmed.",
    )
  }

  // Ask Paystack what really happened.
  const response = await fetch(
    `https://api.paystack.co/transaction/verify/${reference}`,
    {
      method: "GET",

      headers: {
        Authorization:
          `Bearer ${secretKey}`,
      },
    },
  )

  const result =
    (await response.json()) as PaystackVerifyResponse

  if (
    !response.ok ||
    !result.status
  ) {
    throw new Error(
      result.message ||
        "Could not verify payment.",
    )
  }

  // Paystack sends amounts in cents.
  const expectedAmount =
    Math.round(
      Number(payment.amount) * 100,
    )

  // Make sure the customer paid
  // the correct amount.
  if (
    result.data.amount !==
    expectedAmount
  ) {
    throw new Error(
      "Payment amount does not match booking total.",
    )
  }

  // We only accept ZAR.
  if (
    result.data.currency !== "ZAR"
  ) {
    throw new Error(
      "Payment currency is invalid.",
    )
  }

  // The payment must actually be successful.
  if (
    result.data.status !==
    "success"
  ) {
    throw new Error(
      "Payment has not been completed successfully.",
    )
  }

  // If we've already processed this payment,
  // simply return it.
  if (
    payment.status === "SUCCESS" &&
    payment.booking.status ===
      "CONFIRMED"
  ) {
    return payment
  }

  // Update the Payment and Booking together.
  const updatedPayment =
    await prisma.$transaction(
      async (tx) => {
        const confirmedPayment =
          await tx.payment.update({
            where: {
              id: payment.id,
            },

            data: {
              status: "SUCCESS",
            },
          })

        await tx.booking.update({
          where: {
            id: payment.bookingId,
          },

          data: {
            status: "CONFIRMED",
          },
        })

        return confirmedPayment
      },
    )

  return updatedPayment
}