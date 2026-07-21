import jwt from "jsonwebtoken";

function readTokenFromCookie(cookieHeader = "") {
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

export const verifyJWT = (req, res, next) => {
    try {
        const token = req.headers["x-user-token"] || readTokenFromCookie(req.headers.cookie);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required!",
            });
        }
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid token",
        });
    }
};
