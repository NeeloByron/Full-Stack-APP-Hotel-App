import { Router } from "express"
import { validateAccessToken } from "../middleware/auth0.middleware.js"
import { initializePaymentController, verifyPaymentController } from "../controllers/payment.controller.js"

const router = Router()

// Only logged-in users can initialize payments.
router.post( "/initialize", validateAccessToken, initializePaymentController,)

router.get("/verify/:reference", validateAccessToken, verifyPaymentController, )
export default router