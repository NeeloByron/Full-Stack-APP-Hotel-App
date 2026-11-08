import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Link, NavLink, useLocation, } from "react-router-dom"
import { useAuth0} from "@auth0/auth0-react"
import { HugeiconsIcon } from "@hugeicons/react"
import { Menu01Icon, UserCircleIcon, Home01Icon, Calendar03Icon, } from "@hugeicons/core-free-icons"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"
import embassyLogo from "@/assets/theembassy-logo.png"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,} from "@/components/ui/dropdown-menu"

// Navbar component
function Navbar() {
  // Auth0 authentication tools
  const { loginWithRedirect, logout, isAuthenticated, isLoading, user} = useAuth0()
  const [showSignOutDialog, setShowSignOutDialog] = useState(false)
  
  const displayName = user?.name ?? user?.email ?? "Guest"

  const { pathname } = useLocation()

  const isHosting = pathname === "/hosting" || pathname.startsWith("/hosting/")

  const navigation = isHosting ? [
      { label: "Today", path: "/hosting" },
      { label: "Calendar", path: "/hosting/calendar" },
      { label: "Listings", path: "/hosting/listings" },
      { label: "Messages", path: "/hosting/messages" },
    ]
  : [
      { label: "Home", path: "/" },
      { label: "Hotels", path: "/hotels" },
      { label: "My bookings", path: "/bookings" },
    ]

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background">
      <div className="mx-auto flex min-h-24 max-w-[1440px] flex-wrap items-center justify-between gap-x-6 px-5 md:px-8 lg:px-12">
       
       {/* Original TheEmbassy wordmark */}
          <Link
               to="/"
               aria-label="TheEmbassy home"
               className="flex shrink-0 items-center gap-3">
               <img src={embassyLogo} alt="" className="size-11 object-contain sm:size-12" />
               <span className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">TheEmbassy </span>
          </Link>

         {/* Navigation links */}
        <nav aria-label={isHosting ? "Hosting navigation" : "Main navigation"}
           className="order-last flex w-full gap-6 overflow-x-auto md:order-none md:w-auto">
            {navigation.map((item) => (
              <NavLink
                      key={item.path}
                      to={item.path}
                      end
                   className={({ isActive }) => [ "shrink-0 border-b-2 py-4 text-sm font-medium", "transition-colors hover:text-primary",
                   isActive ? "border-primary text-foreground" : "border-transparent text-muted-foreground", ].join(" ") } >
                   {item.label}
                   </NavLink>
                  ))}
         </nav>

     {/* Profile and account controls */}
     <div className="flex items-center gap-3">
      <Link
           to={isHosting ? "/" : "/hosting"}
           className="hidden rounded-full px-4 py-3 text-sm font-medium transition-colors hover:bg-muted lg:inline-flex">
           {isHosting ? "Switch to travelling" : "Switch to hosting"}
       </Link>

      {/* Profile avatar */}
        <span aria-label={ isAuthenticated ? `${user?.name ?? "Guest"} account` : "Guest account" }
      className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-sm font-semibold text-primary">
       {isAuthenticated ? ( (user?.name ?? user?.email ?? "G").charAt(0).toUpperCase()
        ) : (
         <HugeiconsIcon
                        icon={UserCircleIcon}
                        size={22}
                        aria-hidden="true" />
                    )}
              </span>

    
{/* Account dropdown */}
<DropdownMenu>
  <DropdownMenuTrigger
    render={
      <Button
        type="button"
        variant="ghost"
        size="icon"
        aria-label="Open account menu"
        className="size-10 rounded-full bg-muted hover:bg-accent"
      />
    }
  >
    <HugeiconsIcon
      icon={Menu01Icon}
      size={20}
      aria-hidden="true"
    />
  </DropdownMenuTrigger>

  <DropdownMenuContent
    align="end"
    sideOffset={14}
    className="max-h-[70dvh] w-72 max-w-[calc(100vw-2rem)] overflow-y-auto rounded-2xl border-border p-3 shadow-xl">
    
    <DropdownMenuGroup>
  <DropdownMenuLabel className="px-3 py-2 text-sm">
    {isAuthenticated
      ? "Your TheEmbassy"
      : "Welcome to TheEmbassy"}
  </DropdownMenuLabel>

  {isAuthenticated && (
    <p className="break-words px-3 pb-3 text-xs text-muted-foreground">
      {user?.name ?? user?.email}
    </p>
  )}

  <DropdownMenuItem
    render={<Link to="/bookings" />}
    className="cursor-pointer gap-3 rounded-xl px-3 py-3"
  >
    <HugeiconsIcon
      icon={Calendar03Icon}
      size={20}
      aria-hidden="true"
    /> My bookings
  </DropdownMenuItem>

  <DropdownMenuItem
    render={<Link to="/hotels" />}
    className="cursor-pointer gap-3 rounded-xl px-3 py-3">
    <HugeiconsIcon
      icon={Home01Icon}
      size={20}
      aria-hidden="true"
    /> Explore stays
  </DropdownMenuItem>

  <DropdownMenuItem
    render={<Link to="/profile" />}
    className="cursor-pointer gap-3 rounded-xl px-3 py-3">
    <HugeiconsIcon
      icon={UserCircleIcon}
      size={20}
      aria-hidden="true"/>Profile

    <span className="ml-auto text-[10px]">Coming soon</span>
  </DropdownMenuItem>

  <DropdownMenuItem
  render={<Link to={isHosting ? "/" : "/hosting"} />}
  className="cursor-pointer gap-3 rounded-xl px-3 py-3"
>
  <HugeiconsIcon
    icon={Home01Icon}
    size={20}
    aria-hidden="true"
  />
  {isHosting ? "Switch to travelling" : "Switch to hosting"}
</DropdownMenuItem>

</DropdownMenuGroup>

<DropdownMenuSeparator className="my-2" />

    {/* Account features awaiting their pages */}
    <DropdownMenuGroup>
  <DropdownMenuLabel className="px-3 py-2 text-xs font-normal text-muted-foreground">
    Account
  </DropdownMenuLabel>

  <DropdownMenuItem
    disabled
    className="rounded-xl px-3 py-3"
  >
    Account settings

    <span className="ml-auto text-[10px]">
      Coming soon
    </span>
  </DropdownMenuItem>
</DropdownMenuGroup>

    <DropdownMenuSeparator className="my-2" />

    {/* Authentication */}
    {isLoading ? (
      <DropdownMenuItem disabled className="px-3 py-3">
        Loading account…
      </DropdownMenuItem>
    ) : isAuthenticated ? (
      <DropdownMenuItem
        onClick={() => setShowSignOutDialog(true)}
        className="cursor-pointer rounded-xl px-3 py-3"
      > Sign out
      </DropdownMenuItem>
    ) : (
      <>
        <DropdownMenuItem
          onClick={() => loginWithRedirect()}
          className="cursor-pointer rounded-xl px-3 py-3 font-semibold">Log in
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={() =>
            loginWithRedirect({
              authorizationParams: {
                screen_hint: "signup",
              },
            })
          }
          className="cursor-pointer rounded-xl px-3 py-3"
        >
          Create an account
        </DropdownMenuItem>
      </>
    )}
  </DropdownMenuContent>
</DropdownMenu>

{/* Keep the confirmation outside the dropdown so it stays mounted. */}
<AlertDialog
  open={showSignOutDialog}
  onOpenChange={setShowSignOutDialog}
>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>
        Are you sure you want to sign out?
      </AlertDialogTitle>

      <AlertDialogDescription>
        You’ll need to log in again to manage your bookings.
      </AlertDialogDescription>
    </AlertDialogHeader>

    <AlertDialogFooter>
      <AlertDialogCancel>
        Stay logged in
      </AlertDialogCancel>

      <AlertDialogAction
        onClick={() =>
          logout({
            logoutParams: {
              returnTo: window.location.origin,
            },
          })
        }
      >
        Sign out
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
        
       </div>
      </div>
    </header>
  )
}

export default Navbar