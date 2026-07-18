import User from "../models/user.model.js";

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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
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
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

export const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.json({
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
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message
        });
    }
};
