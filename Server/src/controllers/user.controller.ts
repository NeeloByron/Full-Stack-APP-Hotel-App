import type { Request, Response } from "express"
import { syncAuthUser } from "../service/user.service.js"

export async function getCurrentUser(
  req: Request,
  res: Response,
) {
  try {
    // Auth0 stores the unique user ID in "sub".
    const auth0Id = req.auth?.payload.sub

    if (!auth0Id) {
      return res.status(401).json({
        success: false,
        message: "Authentication required.",
      })
    }

    // These values may be present in the access token.
    const email =
      typeof req.auth?.payload.email === "string"
        ? req.auth.payload.email
        : undefined

    const name =
      typeof req.auth?.payload.name === "string"
        ? req.auth.payload.name
        : undefined

    // Find or create the user in Neon.
    const user = await syncAuthUser({
      auth0Id,
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    })

    return res.status(200).json({
      success: true,
      data: user,
    })
  } catch (error) {
    console.error("Get current user error:", error)

    return res.status(500).json({
      success: false,
      message: "Could not load user.",
    })
  }
}