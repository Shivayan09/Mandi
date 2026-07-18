import { Router } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";

const chatRouter = Router();

chatRouter.use(
    "/",
    createProxyMiddleware({
        target: process.env.CHAT_SERVICE_URL,
        changeOrigin: true,
        ws: true,
        pathRewrite: {
            "^/": "/chat/",
        },
    })
);

export default chatRouter;