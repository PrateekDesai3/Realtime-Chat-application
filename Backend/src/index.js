import express from 'express';
import messageRoutes from './routes/message.js';
import authRoutes from "./routes/auth.js";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./lib/db.js";
import cors from "cors";
import { app ,server} from './lib/socket.js';
// import {app,server} from "./lib/socket.js"


dotenv.config();
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
  }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);


const PORT = process.env.PORT || 5001; // Use PORT from environment or default to 5001
connectDB()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`SERVER listening on PORT : ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1); // Exit process with failure code
  });
