import User from "../models/user.model.js";
import redis from "../config/redis.js";

export const getUserByEmail = async (req, res) => {
    try {
        const user = await User.findOne({email: req.params.email});
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const createUser = async (req, res) => {
    try {
        const { name, email, phoneNumber } = req.body;
        if (!name || !email || !phoneNumber) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        const user = await User.create({ name, email, phoneNumber});
        res.status(201).json(user);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const {userId} = req.params;
        const cacheKey = `user:${userId}`;
        const cachedUser = await redis.get(cacheKey);
        if (cachedUser) {
            return res.json(JSON.parse(cachedUser));
        }
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }
        const responseData = {
            success: true,
            user: {
                userId: user._id,
                name: user.name,
                email: user.email,
                phoneNumber: user.phoneNumber,
                emailVerified: user.emailVerified,
                provider: user.provider,
                onboardingCompleted: user.onboardingCompleted,
            }
        };
        await redis.setEx( cacheKey, 3600, JSON.stringify(responseData));
        return res.json(responseData);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
