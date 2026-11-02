import { api } from "./api"

export type RoomType = {
  id: number
  name: string
  description: string | null
  capacity: number
  quantity: number
  price: string
  image: string | null
}

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

type HotelsResponse = {
  success: boolean
  data: Hotel[]
}

type HotelResponse = {
  success: boolean
  data: Hotel
}

export async function getHotels() {
  const response = await api.get<HotelsResponse>("/hotels")

  return response.data.data
}

export async function getHotelBySlug(slug: string) {
  const response = await api.get<HotelResponse>(`/hotels/${slug}`)

  return response.data.data
}