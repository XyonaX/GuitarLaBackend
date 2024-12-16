import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String, unique: true, required: true },
  password: {  type: String },
  fullName: { type: String, required: true },
  dateOfBirth: { type: String }, 
  phone: { type: String },
  address: { type: String },
  role: { type: String, enum: ["admin", "user"], default: "user" },
  status: { type: String, enum: ["activo", "inactivo"], default: "activo" },
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

export default User;
