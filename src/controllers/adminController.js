import Admin  from "../models/admin.js";
import Course from "../models/Course.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
 
const { sign } = jwt;

export async function adminSignup(req, res) {
  try {
    const { username, password } = req.body;
 
    const salt = await bcrypt.genSalt(10);   
    const hashedPassword = await bcrypt.hash(password, salt);  
 
    const admin = new Admin({ username, password: hashedPassword });
    await admin.save();

    res.json({ message: "✅ Admin registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "❌ Error signing up admin" });
  }
}

export async function adminLogin(req, res) {
  try {
    const { username, password } = req.body;

     
    const admin = await Admin.findOne({ username });

    if (!admin) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

     const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "❌ Invalid credentials" });
    }

    const token = sign({ id: admin._id, role: "admin" }, process.env.JWT_SECRET);

    res.json({ message: "✅ Admin logged in successfully", token });
    

  } catch (error) {
    res.status(500).json({ message: "❌ Error logging in admin" });
  }
}


 
export async function createCourse(req, res) {
  try {
    console.log("Request User:", req.user);  
    console.log("User ID:", req.user.id);  

    if (!req.user || !req.user.id) {
      return res.status(401).json({ message: "❌ Unauthorized: Admin not logged in" });
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

    console.log("New Course Data:", newCourse);  

    await newCourse.save();
    res.json({ message: "✅ Course created successfully", data : newCourse , token});
  } catch (error) {
    res.status(500).json({ message: "❌ Error creating course", error });
  }
}



export async function getCourses(req, res) {
  const courses = await Course.find();
  res.json(courses);
}
