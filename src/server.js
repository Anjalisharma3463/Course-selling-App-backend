import express, { json } from "express";
import { config } from "dotenv";
 
import connectDB from "./config/db.js";
import adminRoutes from "./routes/adminRoutes.js"
import userRoutes from "./routes/userRoutes.js";
import cors from "cors";
 import path from "path";
 
config();
connectDB();

const app = express();
app.use(express.json());
 

app.use(json());


app.use(cors({ origin: "http://localhost:5173", credentials: true }));
 
app.use("/uploads", express.static(path.join("uploads")));
    
  
app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);

const PORT = 4000;  
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));

 
 