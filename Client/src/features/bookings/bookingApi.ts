import { createApi, fetchBaseQuery, } from "@reduxjs/toolkit/query/react"

type CreateBookingRequest = {
  hotelId: number
  roomTypeId: number
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
}

type Booking = {
  id: number
  hotelId: number
  roomTypeId: number
  checkIn: string
  checkOut: string
  guests: number
  rooms: number
  nightlyPrice: string
  totalPrice: string
  status: | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"
}

type CreateBookingResponse = {
  success: boolean
  message: string
  data: Booking
}

export const bookingApi = createApi({
  reducerPath: "bookingApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),

  endpoints: (builder) => ({
    createBooking: builder.mutation<
        CreateBookingResponse,
        CreateBookingRequest
      >({
          query: (booking) => ({
          url: "/bookings",
          method: "POST",
          body: booking,
        }),
      }),
  }),
})

export const {
                 useCreateBookingMutation,
             } = bookingApi