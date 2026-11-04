import { configureStore } from "@reduxjs/toolkit"
import bookingReducer from "@/features/bookings/bookingSlice"
import { hotelApi } from "@/services/hotelApi"
import { bookingApi } from "@/features/bookings/bookingApi"

export const store = configureStore({
  reducer: {
    booking: bookingReducer,

    // RTK Query keeps API data here
    [hotelApi.reducerPath]: hotelApi.reducer,
    [bookingApi.reducerPath]: bookingApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      hotelApi.middleware,
      bookingApi.middleware,
    ),
})

// TypeScript types generated from the store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch