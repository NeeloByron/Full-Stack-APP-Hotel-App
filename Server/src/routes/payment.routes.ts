import { Router } from "express"
import { validateAccessToken } from "../middleware/auth0.middleware.js"
import { initializePaymentController } from "../controllers/payment.controller.js"

const router = Router()

// Only logged-in users can initialize payments.
router.post( "/initialize", validateAccessToken, initializePaymentController,)

export default router