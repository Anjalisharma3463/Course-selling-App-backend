import express from "express";
import { adminSignup, adminLogin, createCourse, getCourses } from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
router.post("/courses", authMiddleware, upload.single("image"), createCourse);
router.get("/courses", getCourses);

export default router;  
