import express, { json } from "express";
import { config } from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js"; // Ensure the correct relative path

import adminRoutes from "./routes/adminRoutes.js";
import userRoutes from "./routes/userRoutes.js";

config();
connectDB();

const app = express();
app.use(express.json())
app.use(cors());
app.use(json());    

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

app.listen(3000, () => console.log("🚀 Server running on port 3000"));
