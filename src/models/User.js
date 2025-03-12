import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, 
  purchasedCourses: [{ type: Schema.Types.ObjectId, ref: "Course" }]
});

export default model("User", userSchema);
