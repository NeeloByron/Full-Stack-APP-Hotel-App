import { Routes, Route } from "react-router-dom"
import HomePage from "@/pages/Home/HomePage"
import HotelsPage from "@/pages/Hotels/HotelsPage"
import HotelDetailsPage from "@/pages/HotelDetails/HotelDetailsPage"
import BookingPage from "@/pages/Booking/BookingPage"
import AuthTestPage from "@/pages/AuthTest/AuthTestPage"
import MyBookingsPage from "@/pages/Booking/MyBookingsPage"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/hotels/:slug" element={<HotelDetailsPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/auth-test" element={<AuthTestPage />} />
      <Route path="/bookings" element={<MyBookingsPage />} />
    </Routes>
  )
}

export default AppRoutes