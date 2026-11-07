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

type CreateBookingArgs = {
  booking: CreateBookingRequest
  accessToken: string
}

type BookingHotel = {
  id: number
  name: string
  slug: string
  mainImage: string
  city: string
}

type BookingRoom = {
  id: number
  name: string
  price: string
}

export type MyBooking = {
  id: number

  hotelId: number
  roomTypeId: number
  userId: number | null

  checkIn: string
  checkOut: string

  guests: number
  rooms: number

  nightlyPrice: string
  totalPrice: string

  status: | "PENDING" | "CONFIRMED" | "CANCELLED" | "COMPLETED"

  hotel: BookingHotel
  roomType: BookingRoom
}

type MyBookingsResponse = {
  success: boolean
  data: MyBooking[]
}

export const bookingApi = createApi({
  reducerPath: "bookingApi",

  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),

  endpoints: (builder) => ({
    createBooking: builder.mutation<
        CreateBookingResponse,
        CreateBookingArgs
      >({
          query: ({booking, accessToken }) => ({
          url: "/bookings",
          method: "POST",
          body: booking,

          headers: { Authorization: `Bearer ${accessToken}`,
          }
        }),
      }),

      // Get bookings belonging to the logged-in user
      getMyBookings: builder.query<
       MyBookingsResponse,
       string
     >({
      query: (accessToken) => ({
       url: "/bookings/me",

        headers: { Authorization: `Bearer ${accessToken}`,
      },
   
      }),
    }),
  }),
})

export const {
                 useCreateBookingMutation,
                 useGetMyBookingsQuery,
             } = bookingApi