import express from "express"; 
import cors from "cors"; // frontend can make requests to the backend 
import helmet from "helmet"; // security-related HTTP headers
import dotenv from "dotenv"; // .env variable can be read
import { prisma } from "./config/prisma.js" // backend can talk to Neon PostgreSQL

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4001;

app.use(helmet()); // add security-related HTTP headers
// allow our react frontend to talk to this backend 
app.use(cors({origin: "http://localhost:5173",}));
// allow express to understand JSON data sent in requests
app.use(express.json());

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

// this starts the express server and listens for requests.
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});