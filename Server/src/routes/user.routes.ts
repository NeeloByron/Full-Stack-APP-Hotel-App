import { Router } from "express"
import { getCurrentUser } from "../controllers/user.controller.js"
import { validateAccessToken } from "../middleware/auth0.middleware.js"

const router = Router()

// Only logged-in users can access this route.
router.get("/me", validateAccessToken, getCurrentUser,)

export default router