import dotenv from "dotenv"
import path from "path"
import { auth } from "express-oauth2-jwt-bearer"

// load server/.env explicitly
const envPath = path.resolve(
  import.meta.dirname,
  "../../.env"
)

dotenv.config({
  path: envPath,
})

// make sure Auth0 domain exists
if (!process.env.AUTH0_DOMAIN) {
  throw new Error(
    "AUTH0_DOMAIN is missing from Server/.env"
  )
}

// make sure Auth0 audience exists
if (!process.env.AUTH0_AUDIENCE) {
  throw new Error(
    "AUTH0_AUDIENCE is missing from Server/.env"
  )
}

// Validates access tokens sent by the React frontend
export const validateAccessToken = auth({
  issuerBaseURL: `https://${process.env.AUTH0_DOMAIN}`,
  audience: process.env.AUTH0_AUDIENCE!,
})