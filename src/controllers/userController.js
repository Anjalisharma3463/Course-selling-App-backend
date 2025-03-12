import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { hash, compare } from "bcryptjs"; 
import Course from "../models/Course.js";

const { sign } = jwt;

export const registerUser = async (req, res) => {
  try {
    const { username, email, password  } = req.body;

    if (!username || !email || !password  ) {
      return res.status(400).json({ message: "❌ All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "❌ User already exists." });
    }
 
    const hashedPassword = await hash(password, 10); 

     const newUser = new User({ username, email, password: hashedPassword  });
    await newUser.save();

     const token = sign(
      { id: newUser._id  },
      process.env.JWT_SECRET, 
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "✅ Registration successful",
      user: newUser 
    });

  } catch (error) {
    res.status(500).json({ message: "❌ Registration failed", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ message: "❌ User not found" });

     const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Incorrect password" });

     const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "✅ Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "❌ Login failed", error });
  }
};

 export const getPurchasedCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("purchasedCourses");
    if (!user) return res.status(404).json({ message: "❌ User not found" });

    res.json({ purchasedCourses: user.purchasedCourses });
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching purchased courses", error });
  }
};

 
export const purchaseCourse = async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    console.log("req.body while purchasing a course : ", req.body)
    if (!userId || !courseId) {
      return res.status(400).json({ message: "❌ User ID and Course ID are required" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId);

    if (!user) return res.status(404).json({ message: "❌ User not found" });
    if (!course) return res.status(404).json({ message: "❌ Course not found" });

     
    if (user.purchasedCourses.includes(courseId)) {
      return res.status(400).json({ message: "❌ Course already purchased" });
    }

  
    user.purchasedCourses.push(courseId);
    await user.save();

    res.status(200).json({ message: "✅ Course purchased successfully", purchasedCourses: user.purchasedCourses });
  } catch (error) {
    res.status(500).json({ message: "❌ Error purchasing course", error });
  }
};
