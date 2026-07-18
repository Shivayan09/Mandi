import jwt from "jsonwebtoken";
import Auth from "../models/auth.model.js";

export async function requireAuth(req, res, next) {
  const token = req.cookies?.token;

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const authUser = await Auth.findOne({
      userId: decoded.userId,
      email: decoded.email,
    }).select("userId email");

    if (!authUser) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    req.authUser = {
      userId: String(authUser.userId),
      email: authUser.email,
    };

    return next();
  } catch {
    return res.status(401).json({
      success: false,
      message: "Unauthorized",
    });
  }
}
