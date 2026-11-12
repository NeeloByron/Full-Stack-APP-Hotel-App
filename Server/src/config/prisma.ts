import dotenv from "dotenv"
import { setDefaultAutoSelectFamily } from "node:net"
import { setDefaultResultOrder } from "node:dns"

import { PrismaClient } from "../../generated/prisma/client.js"
import { PrismaPg } from "@prisma/adapter-pg"

// Load Server/.env
dotenv.config({
  override: true,
})

// Force Node to prefer IPv4 and stop automatic
// IPv4/IPv6 connection racing on this machine.
setDefaultAutoSelectFamily(false)
setDefaultResultOrder("ipv4first")

const databaseUrl = process.env.DATABASE_URL

if (!databaseUrl) {
  throw new Error(
    "DATABASE_URL is missing from Server/.env",
  )
}

console.log(
  "Database host:",
  new URL(databaseUrl).hostname,
)

const adapter = new PrismaPg({
  connectionString: databaseUrl,
  connectionTimeoutMillis: 30_000,
})

export const prisma = new PrismaClient({
  adapter,
})