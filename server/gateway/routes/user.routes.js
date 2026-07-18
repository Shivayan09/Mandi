import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const userRouter = Router();

userRouter.use("/", createProxyMiddleware({
    target: process.env.USER_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/": "/users/",
    },
}));

export default userRouter
