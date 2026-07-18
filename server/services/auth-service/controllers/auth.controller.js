import bcrypt from 'bcryptjs';
import axios from "axios"
import jwt from 'jsonwebtoken';
import Auth from '../models/auth.model.js';
import { requireAuth } from "../middlewares/auth.middleware.js";

export const register = async (req, res) => {
    const { name, email, phoneNumber, password } = req.body;
    if (!name || !email || !phoneNumber || !password) {
        return res.status(400).json({
            success: false,
            message: "All fields are required!"
        })
    }
    try {
        const existingUser = await Auth.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists!"
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const response = await axios.post(`${process.env.USER_SERVICE_URL}/users/register`, { name, email, phoneNumber });
        const user = response.data;
        await Auth.create({ userId: user._id, email, password: hashedPassword });
        const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", });
        res.status(201).json({
            success: true,
            message: "Registration successfull!"
        });
    } catch (error) {
        console.error("Register failed:", error.response?.data || error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to register!"
        })
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({
            success: false,
            message: "All fields are required!"
        })
    }
    try {
        const user = await Auth.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found!"
            })
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password!"
            })
        }
        const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.cookie("token", token, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", });
        res.status(200).json({
            success: true,
            message: "Logged in successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to login!"
        })
    }
}

export const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });
        return res.status(200).json({
            success: true,
            message: "Logged out successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to logout!"
        });
    }
};

export const me = [requireAuth, async (req, res) => {
        try {
            const authUser = req.authUser;
            const response = await axios.get( `${process.env.USER_SERVICE_URL}/users/${authUser.userId}`);
            const profile = response.data.user ?? response.data;
            if (!profile) {
                return res.status(404).json({
                    success: false,
                    message: "User not found!",
                });
            }
            return res.status(200).json({
                success: true,
                user: {
                    userId: authUser.userId,
                    email: authUser.email,
                    name: profile.name,
                    phoneNumber: profile.phoneNumber,
                    provider: profile.provider,
                    emailVerified: profile.emailVerified,
                    onboardingCompleted: profile.onboardingCompleted,
                },
            });
        } catch (error) {
            return res.status(500).json({
                success: false,
                message: error.response?.data?.message || "Failed to load user profile!",
            });
        }
    }
];
