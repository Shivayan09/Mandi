import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const authRouter = Router();

authRouter.use("/", createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
        "^/": "/auth/",
    },
    on: {
        proxyReq: fixRequestBody
    }
}));

export default authRouter
