import { Router } from "express";
import {FetchUserDetails, registerUser, loginUser, purchaseCourse, getPurchasedCourses } from "../controllers/userController.js";
import authMiddleware from "../middleware/auth.js";

const router = Router();

router.post("/signup", registerUser);
router.post("/login", loginUser);


router.post("/courses/:courseId", authMiddleware, purchaseCourse);
router.get("/purchasedCourses", authMiddleware, getPurchasedCourses);
router.get("/:id" , FetchUserDetails);
    
 
export default router;
