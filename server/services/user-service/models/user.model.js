import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true, minLength: 2, maxLength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phoneNumber: { type: String, minlength: 10 },
    emailVerified: { type: Boolean, default: false },
    googleId: { type: String, unique: true, sparse: true },
    provider: { type: String, enum: ["local", "google"], default: "local" },
    onboardingCompleted: { type: Boolean, default: false },
})

const User = mongoose.model("User", userSchema);
export default User;