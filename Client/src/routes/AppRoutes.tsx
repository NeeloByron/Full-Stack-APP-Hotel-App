import { Routes, Route } from "react-router-dom"
import HomePage from "@/pages/Home/HomePage"
import HotelsPage from "@/pages/Hotels/HotelsPage"
import HotelDetailsPage from "@/pages/HotelDetails/HotelDetailsPage"
import BookingPage from "@/pages/Booking/BookingPage"
import AuthTestPage from "@/pages/AuthTest/AuthTestPage"
import MyBookingsPage from "@/pages/Booking/MyBookingsPage"
import ProfilePage from "@/pages/Profile/ProfilePage"
import HostPage from "@/pages/Host/HostPage"
import PaymentCallbackPage from "@/pages/Payment/PaymentCallbackPage"
import AdminListingsPage from "@/pages/Host/AdminListingsPage"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hotels" element={<HotelsPage />} />
      <Route path="/hotels/:slug" element={<HotelDetailsPage />} />
      <Route path="/booking" element={<BookingPage />} />
      <Route path="/auth-test" element={<AuthTestPage />} />
      <Route path="/bookings" element={<MyBookingsPage />} />
      <Route path="/payment/callback" element={<PaymentCallbackPage />}/>

      <Route path="/profile" element={<ProfilePage />} />

      <Route path="/hosting" element={<HostPage />} />
      <Route path="/hosting/calendar" element={<HostPage />} />
      <Route path="/hosting/listings" element={<AdminListingsPage />} />
      <Route path="/hosting/messages" element={<HostPage />} />

    </Routes>
  )
}

export default AppRoutes