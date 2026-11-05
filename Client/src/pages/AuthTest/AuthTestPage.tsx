import { useState } from "react"
import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"

function AuthTestPage() {
  const {
    isAuthenticated,
    getAccessTokenSilently,
  } = useAuth0()

  const [message, setMessage] = useState("")

  async function testProtectedRoute() {
     try {
           // Ask Auth0 for an access token
           const token = await getAccessTokenSilently()

          // Send that token to our Express backend
          const response = await fetch("/api/protected", {
           headers: {
                    Authorization: `Bearer ${token}`,
             },
           })

      const data = await response.json()

      setMessage(data.message)
    } catch (error) {
      console.error(error)
      setMessage("Authentication test failed")
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-16">
      <h1 className="text-3xl font-medium">Authentication test</h1>
      <p className="mt-4">Logged in: {isAuthenticated ? "Yes" : "No"}</p>

      <Button
              className="mt-6"
              onClick={testProtectedRoute}
              disabled={!isAuthenticated} > Test protected API </Button>

       {message && (
        <p className="mt-6">{message}</p>
      )}
    </main>
  )
}

export default AuthTestPage