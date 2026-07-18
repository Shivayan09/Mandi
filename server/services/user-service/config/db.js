import mongoose from "mongoose";

const connectDB = async () => {
    try {
        if (!process.env.MONGO_URI) {
            throw new Error("MONGO_URI is not defined");
        }
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected successfully!");
    } catch (error) {
        console.error("MongoDB Connection Failed");
        console.error(error.message);
        process.exit(1);
    }
};

export default connectDB;
