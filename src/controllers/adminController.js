import user  from "../models/User.js";
import Course from "../models/Course.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../models/User.js";

export async function createCourse(req, res) {
  try { 

    if (!req.user || req.user.role !== "admin") {
      return res.status(401).json({ message: "❌ Unauthorized: Only admins can create courses" });
    }

    const { title, description, price } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: "❌ Image upload is required" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

   
    const newCourse = new Course({
      title,
      description,
      price,
      image: imageUrl,
      createdBy: req.user.id,  
    });

    await newCourse.save();

  
    await User.findByIdAndUpdate(req.user.id, {
      $push: { createdCourses: newCourse._id },
    });

    res.json({ message: "✅ Course created successfully", data: newCourse });
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating course", error });
  }
}




export async function getCourses(req, res) {
  const courses = await Course.find();
   res.json(courses);
}

export const GetAdminCreatedCourses = async (req, res) => {
 
  if (!req.user) {
    return res.status(401).json({ message: "User not found in request object" });
  }

  try {
    const courses = await Course.find({ createdBy: req.user.id });

    return res.json({ adminCourses: courses });  
  } catch (error) {
    console.error("Error fetching admin courses:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};