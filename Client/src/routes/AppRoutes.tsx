import { Routes, Route } from "react-router-dom"
import HomePage from "@/pages/Home/HomePage"
import HotelsPage from "@/pages/Hotels/HotelsPage"

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/hotels" element={<HotelsPage />} />
    </Routes>
  )
}

export default AppRoutes