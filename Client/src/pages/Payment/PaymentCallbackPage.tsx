import { useEffect, useState, } from "react"
import { useSearchParams, Link, } from "react-router-dom"
import { useAuth0 } from "@auth0/auth0-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, } from "@/components/ui/card"

type PaymentState = | "checking" | "success" | "failed"

function PaymentCallbackPage() {
  const [searchParams] = useSearchParams()
  const { getAccessTokenSilently, } = useAuth0()
  const [ paymentState, setPaymentState, ] = useState<PaymentState>("checking",)
  const [ message, setMessage, ] = useState( "Confirming your payment...",)

  useEffect(() => {
    async function verifyPayment() {
      try {
        // Paystack adds this to the callback URL.
        const reference =
          searchParams.get(
            "reference",
          )

        if (!reference) {
          setPaymentState(
            "failed",
          )

          setMessage(
            "Payment reference is missing.",
          )

          return
        }

        // Get Auth0 access token.
        const accessToken =
          await getAccessTokenSilently()

        // Ask our backend to verify
        // the transaction with Paystack.
        const response =
          await fetch(
            `/api/payments/verify/${encodeURIComponent(
              reference,
            )}`,
            {
              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
              },
            },
          )

        const result =
          await response.json()

        if (
          !response.ok ||
          !result.success
        ) {
          throw new Error(
            result.message || "Payment verification failed.",
          )
        }

        setPaymentState(
          "success",
        )

        setMessage(
          "Your booking is confirmed.",
        )
      } catch (error) {
        console.error(
          "Payment verification failed:",
          error,
        )

        setPaymentState(
          "failed",
        )

        setMessage(
          error instanceof Error
            ? error.message
            : "We could not verify your payment.",
        )
      }
    }

    verifyPayment()
  }, [
    getAccessTokenSilently,
    searchParams,
  ])

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex max-w-xl px-6 py-20">
        <Card className="w-full">
          <CardContent className="px-8 py-12 text-center">
            {paymentState ===
              "checking" && (
              <>
                <p className="text-sm font-medium text-primary">Payment</p>

                <h1 className="mt-3 text-3xl font-semibold">Confirming payment</h1>

                <p className="mt-3 text-sm text-muted-foreground">{message}</p>
              </>
            )}

            {paymentState ===
              "success" && (
              <>
                <p className="text-sm font-medium text-primary">Payment successful
                </p>

                <h1 className="mt-3 text-3xl font-semibold">
                  Booking confirmed
                </h1>

                <p className="mt-3 text-sm text-muted-foreground">
                  {message}
                </p>

                <Button
                  className="mt-8 rounded-full px-8"
                  render={
                    <Link to="/bookings" />
                  }
                >
                  View my bookings
                </Button>
              </>
            )}

            {paymentState ===
              "failed" && (
              <>
                <p className="text-sm font-medium text-destructive">
                  Payment problem
                </p>

                <h1 className="mt-3 text-3xl font-semibold">
                  We couldn't confirm your payment
                </h1>

                <p className="mt-3 text-sm text-muted-foreground">
                  {message}
                </p>

                <Button
                  className="mt-8 rounded-full px-8"
                  render={
                    <Link to="/bookings" />
                  }
                >
                  View my bookings
                </Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

export default PaymentCallbackPage