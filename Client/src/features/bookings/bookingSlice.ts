import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

type BookingState = {
  hotelSlug: string | null
  roomTypeId: number | null

  checkIn: string
  checkOut: string

  guests: number
  rooms: number
}

const initialState: BookingState = {
  hotelSlug: null,
  roomTypeId: null,

  checkIn: "",
  checkOut: "",

  guests: 1,
  rooms: 1,
}

const bookingSlice = createSlice({
  name: "booking",

  initialState,

  reducers: {
    setHotelSlug: ( state, action: PayloadAction<string> ) => {
      state.hotelSlug = action.payload
    },

    setRoomType: ( state, action: PayloadAction<number> ) => {
      state.roomTypeId = action.payload
    },

    setCheckIn: ( state, action: PayloadAction<string> ) => {
      state.checkIn = action.payload
    },

    setCheckOut: ( state, action: PayloadAction<string> ) => {
      state.checkOut = action.payload
    },

    setGuests: ( state, action: PayloadAction<number> ) => {
      state.guests = action.payload
    },

    setRooms: ( state, action: PayloadAction<number> ) => {
      state.rooms = action.payload
    },

    clearBooking: () => initialState,
  },
})

export const {
  setHotelSlug,
  setRoomType,
  setCheckIn,
  setCheckOut,
  setGuests,
  setRooms,
  clearBooking,
} = bookingSlice.actions

export default bookingSlice.reducer