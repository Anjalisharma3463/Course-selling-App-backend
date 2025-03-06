import Course from "../models/Course.js";

export const addCourse = async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({ message: "✅ Course added successfully", course });
  } catch (error) {
    res.status(500).json({ message: "❌ Failed to add course", error });
  }
};

export const getCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "❌ Error fetching courses", error });
  }
};

