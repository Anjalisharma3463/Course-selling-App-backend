import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs"; 
import Course from "../models/Course.js";

const { sign } = jwt;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password , role } = req.body;
    console.log("req.body in signup in backend",req.body);
  
    if (!username || !email || !password  ) {
      return res.status(400).json({ message: "❌ All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists." });
    }
 
    const hashedPassword = await hash(password, 10); 

     const newUser = new User({ username, email, password: hashedPassword , role });
    await newUser.save();

     const token =  sign(
      { id: newUser._id  },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "  Registration successful",
      user: newUser , 
    });

  } catch (error) {
    res.status(500).json({ message: "❌ Registration failed", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password , role} = req.body;
  console.log("req.body in backend",req.body);
  
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "❌ User not found" });

     const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Incorrect password" });

    if (user.role !== role) {
      return res.status(403).json({ message: `❌ Incorrect role selected. You are a ${user.role}.` });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    
    
    res.json({ token, role: user.role, username: user.username });
  } catch (error) {
    res.status(500).json({ message: "  Login failed", error });
  }
};
 
  

 export const getPurchasedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("purchasedCourses");
    if (!user) return res.status(404).json({ message: "  User not found" });

    res.json({ purchasedCourses: user.purchasedCourses });
  } catch (error) {
    res.status(500).json({ message: "  Error fetching purchased courses", error });
  }
};
 

export const FetchUserDetails = async (req, res) => {
  console.log("Incoming Request Params:", req.params);  // 🔥 Debug Here
  console.log("Incoming Request URL:", req.originalUrl); // 🔥 Debug Here

  if (!req.params.id) {
    return res.status(400).json({ message: "❌ Missing user ID" });
  }

  try {
    const user = await User.findById(req.params.id).populate("purchasedCourses");

    if (!user) return res.status(404).json({ message: "❌ User not found" });

    console.log("User details in backend:", user);

    res.status(200).json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "❌ Server error" });
  }
};



export const purchaseCourse = async (req, res) => {
  try {
    const userId = req.user.id; // Get userId from token
    const { courseId } = req.params; // Get courseId from URL params

    console.log("Purchasing Course - User:", userId, "Course:", courseId);

    if (!courseId) {
      return res.status(400).json({ message: "  Course ID is required" });
    }

    // Find user and course
    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) return res.status(404).json({ message: "  User not found" });
    if (!course) return res.status(404).json({ message: "  Course not found" });

    // Check if course is already purchased
    if (user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ message: "  Course already purchased" });
    }

    // Add course to user's purchased list
    user.purchasedCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "  Course purchased successfully", purchasedCourses: user.purchasedCourses });
  } catch (error) {
    console.error("Error purchasing course:", error);
    res.status(500).json({ message: "  Error purchasing course", error });
  }
};


 