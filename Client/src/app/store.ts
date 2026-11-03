import { configureStore } from "@reduxjs/toolkit"
import bookingReducer from "@/features/booking/bookingSlice"
import { hotelApi } from "@/services/hotelApi"

export const store = configureStore({
  reducer: {
    booking: bookingReducer,

    // RTK Query keeps API data here
    [hotelApi.reducerPath]: hotelApi.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(hotelApi.middleware),
})

// TypeScript types generated from the store
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch