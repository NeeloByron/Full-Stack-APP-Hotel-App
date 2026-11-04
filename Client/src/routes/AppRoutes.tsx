import { Routes, Route } from "react-router-dom"
import HomePage from "@/pages/Home/HomePage"
import HotelsPage from "@/pages/Hotels/HotelsPage"
import HotelDetailsPage from "@/pages/HotelDetails/HotelDetailsPage"
import BookingPage from "@/pages/Booking/BookingPage"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/hotels/:id" element={<HotelDetailsPage />} />
      <Route path="/hotels/:slug" element={<HotelDetailsPage />} />
      <Route path="/booking" element={<BookingPage />} />
    </Routes>
  )
}

export default AppRoutes