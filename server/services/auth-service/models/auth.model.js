import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    refreshToken: { type: String, default: null }
}, {
    timestamps: true
});

export default mongoose.model("Auth", authSchema);