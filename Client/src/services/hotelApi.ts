import { createApi, fetchBaseQuery, } from "@reduxjs/toolkit/query/react"

// the structure of a room within a hotel
export type RoomType = {
  id: number
  name: string
  description: string | null
  capacity: number
  quantity: number
  price: string
  image: string | null
}

// the comprehensive data structure of a Hotel entity
export type Hotel = {
  id: number
  name: string
  slug: string
  description: string
  address: string
  city: string
  province: string
  country: string
  starRating: number
  guestRating: number | null
  latitude: number | null
  longitude: number | null
  mainImage: string
  active: boolean
  rooms: RoomType[]
}

// API envelope wrapper for fetching a list of hotels
type HotelsResponse = {
  success: boolean
  data: Hotel[]
}

// API envelope wrapper for fetching a single hotel
type HotelResponse = {
  success: boolean
  data: Hotel
}

// redux toolkit Query API slice definition for handling hotel-related network request 
export const hotelApi = createApi({
  reducerPath: "hotelApi", // the key to store the state slice under in the redux store

  // base config for network requests (automatically prepends "/api" to endpoints)
  baseQuery: fetchBaseQuery({
    baseUrl: "/api",
  }),

  // endpoint definitions for querying data
  endpoints: (builder) => ({
    getHotels: builder.query<Hotel[], void>({
      query: () => "/hotels",

      transformResponse: (
        response: HotelsResponse
      ) => response.data,
    }),

    // fetches a single hotel by its unique slug identifier
    getHotelBySlug: builder.query<Hotel, string>({
      query: (slug) => `/hotels/${slug}`,

      transformResponse: (
        response: HotelResponse
      ) => response.data,
    }),
  }),
})

export const {
  useGetHotelsQuery,
  useGetHotelBySlugQuery,
} = hotelApi