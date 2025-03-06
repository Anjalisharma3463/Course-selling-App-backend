import User  from "../models/User.js";
import jwt from "jsonwebtoken";
const { sign } = jwt;

import { hash, compare } from "bcryptjs";
 
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

     
    const hashedPassword = await hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });

     
    const savedUser = await user.save();
    console.log("✅ User Saved:", savedUser);

    const token = sign({ id: savedUser._id }, process.env.JWT_SECRET);
    
    res.status(201).json({ message: "✅ User registered", token });
  } catch (error) {
    console.error("❌ Registration Error:", error);
    res.status(500).json({ message: "❌ Registration failed", error });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { name, password } = req.body;
    console.log(
     "name password of loginuser :", name , password
    );
    
    const user = await User.findOne({ name });
  console.log("user found for login", user)
    if (!user) return res.status(400).json({ message: "❌ User not found" });

    const isMatch = await compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "❌ Incorrect password" });

    const token = sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ message: "✅ Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "❌ Login failed", error });
  }
};
 