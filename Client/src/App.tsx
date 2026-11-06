import Navbar from "@/components/ui/layout/Navbar"
import AppRoutes from "@/routes/AppRoutes"
import { AuthUserSync } from "@/components/auth/AuthUserSync"

function App () {
   return (
      <>
        <AuthUserSync />
         <Navbar />
         <AppRoutes />
      </>
   )
}

export default App

