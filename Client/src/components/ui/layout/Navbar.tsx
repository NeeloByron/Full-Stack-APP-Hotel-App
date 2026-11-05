import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { useAuth0} from "@auth0/auth0-react"

// Navbar component
function Navbar() {
  // Auth0 authentication tools
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user} = useAuth0()

  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
       
       {/* app name */}
        <div className="flex flex-col leading-none">
          <span className="text-lg font-semibold tracking-tight text-foreground">Stay</span>

          <span className="mt-1 text-xs text-muted-foreground">Hotel booking</span>
        </div>

         {/* Navigation links */}
        <nav className="hidden items-center gap-8 md:flex">
          {/* Link to the Home page */}
          <Link to="/" className="text-sm font-medium text-foreground transition-colors hover:text-primary">Home</Link>
           {/* Link to the Hotels page */}
          <Link to="/hotels" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">Hotels</Link>
           {/* Link to the bookings page */}
          <Link to="/bookings" className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary">My bookings</Link>
        </nav>

        {/* Authentication section */}
        <div className="flex items-center gap-3">

          {/* Show user name when logged in */}
          {isAuthenticated && user && (
            <span className="hidden text-sm text-muted-foreground sm:block">{user.name ?? user.email}</span>
          )}

          {/* Wait until Auth0 has finished checking login state */}
          {!isLoading && (
            <>
              {!isAuthenticated ? (
                <>
                {/* Sign in */}
                   <Button
                           variant="outline"
                           className="rounded-lg px-5"
                           onClick={() =>loginWithRedirect()}>Sign in</Button>

               {/* Create account */}
               <Button
                     className="rounded-lg bg-primary px-5 text-primary-foreground hover:bg-primary/90"
                     onClick={() => loginWithRedirect({
                                                       authorizationParams: {
                                                       screen_hint: "signup",
                                                   },
                                                 })} > Create account </Button>
                 </>
                ) : (
             < Button
                     variant="outline"
                     className="rounded-lg px-5"
                     onClick={() => logout({
                                    logoutParams: {
                                          returnTo: window.location.origin,
                                      },
                                   })}> Sign out </Button>
                 )}
               </>
             )}
        </div>
      </div>
    </header>
  )
}

export default Navbar