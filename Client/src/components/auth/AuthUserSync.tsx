import { useEffect } from "react"
import { useAuth0 } from "@auth0/auth0-react"

export function AuthUserSync() {
  const { isAuthenticated, isLoading, getAccessTokenSilently,} = useAuth0()

  useEffect(() => {
    async function syncUser() {
      // Do nothing until Auth0 has finished loading and the user is actually signed in.
      if (isLoading || !isAuthenticated) {
        return
      }

      try {
        // Get the Auth0 access token.
        const accessToken =
          await getAccessTokenSilently()

        // Send the token to our protected backend route.
        const response = await fetch(
          "/api/users/me",
          {
            method: "GET",

            headers: {
              Authorization:
                `Bearer ${accessToken}`,
            },
          },
        )

        const data = await response.json()

        if (!response.ok) {
          throw new Error( data.message ?? "Could not sync user", )
        }

        console.log( "User synced:", data.data,)
      } catch (error) {
        console.error("User sync failed:", error,)
      }
    }

    syncUser()
  }, [ isAuthenticated, isLoading, getAccessTokenSilently,]
 )

  // This component has no visible UI.
  return null
}