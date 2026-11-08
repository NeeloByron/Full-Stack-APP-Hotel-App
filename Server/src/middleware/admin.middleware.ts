import type { NextFunction, Request, Response, } from "express"
import { prisma } from "../config/prisma.js"

// This runs after Auth0 checks that the user is logged in. then we check our Neon database to see if that user is an ADMIN.
export async function requireAdmin(req: Request, res: Response,next: NextFunction,) {
  try {
    // Auth0 gives us the unique ID of the logged-in user
    const auth0Id = req.auth?.payload.sub

    // No Auth0 gives us the unique ID of the logged-in user.
    if (!auth0Id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      })
    }

    // find this Auth0 user inside our own database.
    const user = await prisma.user.findUnique({
        where: {
          auth0Id,
        },
      })

    // logged into Auth0 but we cannot find them in our database
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      })
    }

    // The user exists but they are not an ADMIN.
    if (user.role !== "ADMIN") {
      return res.status(403).json({
        success: false,
        message: "Admin access required.",
      })
    }
    // they are an ADMIN. Allow the request to continue
    next()
  } catch (error) {
    console.error( "Admin authorization error:", error,)

    return res.status(500).json({
      success: false,
      message: "Could not verify admin access.",
    })
  }
}