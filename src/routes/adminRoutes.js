import express from "express";
import { FetchUserDetails,registerUser, loginUser  } from "../controllers/userController.js";
import {   createCourse, getCourses } from "../controllers/adminController.js";
import authMiddleware from "../middleware/auth.js";
import upload from "../middleware/upload.js";
 
const router = express.Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);
router.post("/courses", authMiddleware, upload.single("image"), createCourse);
router.get("/courses", getCourses);
router.get("/:id" , FetchUserDetails);
export default router;  
