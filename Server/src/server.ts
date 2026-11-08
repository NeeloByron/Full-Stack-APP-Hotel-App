import express from "express"; 
import cors from "cors"; // frontend can make requests to the backend 
import helmet from "helmet"; // security-related HTTP headers
import dotenv from "dotenv"; // .env variable can be read
import { prisma } from "./config/prisma.js" // backend can talk to Neon PostgreSQL
import hotelRoutes from "./routes/hotelRoutes.js"
import bookingRoutes from "./routes/booking.routes.js" // backend can talk to Neon PostgreSQL
import { validateAccessToken } from "./middleware/auth0.middleware.js";
import userRoutes from "./routes/user.routes.js"
import paymentRoutes from "./routes/payment.routes.js"

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4001;

app.use(helmet()); // add security-related HTTP headers
// allow our react frontend to talk to this backend 
app.use(cors({origin: ["http://localhost:5173", "https://full-stack-app-hotel-app-lac.vercel.app",],}));
// allow express to understand JSON data sent in requests
app.use(express.json());

// hotel routes e.g., GET /api/hotels. GET/api/hotels/:slug
app.use("/api/hotels", hotelRoutes)

// booking routes e.g., POST /api/bookings
app.use("/api/bookings",bookingRoutes,)

// users routes
app.use("/api/users", userRoutes)

// payments routes
app.use("/api/payments", paymentRoutes, )

// health check route
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Hotel Booking API is running",
  });
});

// Database connection test route
// Express -> Prisma -> Neon PostgreSQL
app.get("/api/database-test", async (_req, res) => {
  try {
    // asks Primsa to get all records from the connectionT Test table
    const records = await prisma.connectionTest.findMany();

    // if the database request works, sends a successful response
    res.status(200).json({
      success: true,
      message: "Neon database connection is working",
      data: records,
    });
  } catch (error) {
    // shows the real error in the backend terminal this helps with debug problems
    console.error(error);

    // sends a safe error response back to the browser
    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Protected test route Only users with a valid Auth0 access token can access this
app.get("/api/protected", validateAccessToken,(_req, res) => {
    res.status(200).json({
      success: true,
      message: "You are authenticated",
    })
  }
)

// starts the server only when running locally 
    app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
 })

// export the express app so vercel can run it as a functioon
export default app;