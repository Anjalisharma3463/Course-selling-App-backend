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

// app.use(cors())
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "https://course-selling-app-frontend-eta.vercel.app"); // No trailing slash
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    next();
});

// app.use("/uploads", express.static(path.join("uploads")));
    
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
 
app.listen(process.env.PORT, () => console.log(`✅ Server running on port ${process.env.PORT}`));

 
 