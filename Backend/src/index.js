import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import merchantRoutes from "./routes/merchant.routes.js";
import errorHandler from "./middlewares/error.middleware.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/merchants", merchantRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_KEY) {
  console.warn("[WARNING] Supabase URL or Key not set in environment variables!");
}

//starting server
app.listen(PORT, () => {
  console.log(`[SYSTEM] Server running on port ${PORT}...`);
});