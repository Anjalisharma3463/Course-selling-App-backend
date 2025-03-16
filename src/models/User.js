import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "admin"], default: "student" },   
  purchasedCourses: {
    type: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    default: undefined,  
  },
 
  createdCourses: {
    type: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    default: undefined,   },
});
 
userSchema.pre("save", function (next) {
  if (this.role === "admin") {
    this.createdCourses = this.createdCourses || [];
    this.purchasedCourses = undefined;  
  } else {
    this.purchasedCourses = this.purchasedCourses || [];
    this.createdCourses = undefined;  
  }
  next();
});

export default model("User", userSchema);
