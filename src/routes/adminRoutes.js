import { Router } from "express";
import { addCourse, getCourses } from "../controllers/adminController.js";

const router = Router();

router.post("/courses", addCourse);
router.get("/courses", getCourses);

export default router;
