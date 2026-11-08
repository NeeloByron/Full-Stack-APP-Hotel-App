import Navbar from "@/components/ui/layout/Navbar"
import AppRoutes from "@/routes/AppRoutes"
import { AuthUserSync } from "@/components/auth/AuthUserSync"
import { Toaster } from "sonner"
import Footer from "@/components/ui/layout/Footer"
function App () {
   return (
      <>
        <AuthUserSync />
         <Navbar />
         <AppRoutes />
         <Footer />

         <Toaster position="top-right" richColors closeButton />
      </>
   )
}

export default App

