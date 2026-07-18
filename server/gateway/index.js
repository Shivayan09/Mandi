import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.routes.js";
import listingRouter from "./routes/listing.routes.js";
import userRouter from "./routes/user.routes.js";
import { logger } from "./middlewares/logger.middleware.js";
import { rateLimiter } from "./middlewares/rateLimiter.middleware.js";
import { errorHandler } from "./middlewares/error.middleware.js";
import { verifyJWT } from "./middlewares/auth.middleware.js";
import cookieParser from "cookie-parser";
import chatRouter from "./routes/chat.routes.js";

const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3001";
const corsOptions = {
    origin: FRONTEND_URL,
    credentials: true
};

const app = express();

app.use(cookieParser());
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));
app.use(express.json());

app.use(logger);

app.use(rateLimiter);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Gateway is healthy"
    });
});

app.use("/auth", authRouter);
app.use("/users", verifyJWT, userRouter);
app.use("/listing", verifyJWT, listingRouter);
app.use("/chat", verifyJWT, chatRouter);

app.use(errorHandler);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Gateway running on port ${PORT}`);
});
