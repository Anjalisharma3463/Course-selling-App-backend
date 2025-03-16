import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" }, // Role field

  // If user is "user", they should have purchasedCourses
  purchasedCourses: {
    type: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    default: undefined, // Will only be set for student
  },

  // If user is "admin", they should have createdCourses
  createdCourses: {
    type: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    default: undefined, // Will only be set for admins
  },
});

// Pre-save middleware to ensure only admins have createdCourses
userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.createdCourses = this.createdCourses || [];
    this.purchasedCourses = undefined; // Remove purchases for admin
  } else {
    this.purchasedCourses = this.purchasedCourses || [];
    this.createdCourses = undefined; // Remove createdCourses for student
  }
  next();
});

export default model("User", userSchema);
