import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import merchantRoutes from "./routes/merchant.routes.js";
import orderRoutes from "./routes/order.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import weatherRoutes from "./routes/weather.routes.js";
import userRoutes from "./routes/user.routes.js";
import errorHandler from "./middlewares/error.middleware.js";
import { swaggerSpec, swaggerUi } from './config/swagger.config.js';
import cors from 'cors';
import './cron/scheduler.js'; // for cron job
import path from 'path';

dotenv.config();

const app = express();

const isDev = process.env.NODE_ENV === 'development';

// Enable CORS
app.use(cors({origin: process.env.FRONTEND_URL}));
app.set('trust proxy', true); // Trust proxy for rate limiting and IP extraction

// Swagger documentation setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use(express.json());
app.use(cookieParser());

app.use("/api/orders", orderRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/merchants", merchantRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/weather", weatherRoutes);
app.use("/api/users", userRoutes);
// app.use('/uploads/profile-pictures', express.static(path.resolve('Backend/uploads/profile-pictures'))); // Testing in progress

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SUPABASE_ANON_KEY){
  console.warn("[WARNING] Supabase URL or Key not set in environment variables!");
}

//starting server
app.listen(PORT, () => {
  console.log(`[SYSTEM] Server running on port ${PORT}...`);
  console.log(`[DOCS] Swagger UI available at: ${process.env.BACKEND_URL}:${PORT}/api-docs`);
  console.log('[CICD] working');
});

