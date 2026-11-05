import { prisma } from "../config/prisma.js"

type SyncAuthUserInput = {
  auth0Id: string
  email?: string
  name?: string
}

// Find the user by their Auth0 "sub" value. If the user does not exist yet, create them, If they already exist, update their basic profile details.
export async function syncAuthUser({
  auth0Id,
  email,
  name,
}: SyncAuthUserInput) {
  const user = await prisma.user.upsert({
    where: {
      auth0Id,
    },

    update: {
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),
    },

    create: {
      auth0Id,
      ...(email !== undefined ? { email } : {}),
      ...(name !== undefined ? { name } : {}),

      // Every new account starts as a normal user.
      role: "USER",
    },
  })

  return user
}