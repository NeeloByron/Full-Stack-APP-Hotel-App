import Navbar from "@/components/ui/layout/Navbar"
import AppRoutes from "@/routes/AppRoutes"
import { AuthUserSync } from "@/components/auth/AuthUserSync"
import { Toaster } from "sonner"

function App () {
   return (
      <>
        <AuthUserSync />
         <Navbar />
         <AppRoutes />

         <Toaster position="top-right" richColors closeButton />
      </>
   )
}

export default App

