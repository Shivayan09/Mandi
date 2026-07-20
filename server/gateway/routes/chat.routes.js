import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const chatRouter = Router();

function readToken(cookieHeader = "") {
    const match = cookieHeader.match(/(?:^|;\s*)token=([^;]+)/);
    return match ? decodeURIComponent(match[1]) : null;
}

const chatProxy = createProxyMiddleware({
    target: process.env.CHAT_SERVICE_URL,
    changeOrigin: true,
    ws: true,
    on: {
        proxyReq: (proxyReq, req) => {
            fixRequestBody(proxyReq, req);
        },
    },
});

chatRouter.use(
    "/",
    (req, _res, next) => {
        const token = readToken(req.headers.cookie);
        if (token) {
            req.headers["x-user-token"] = token;
        }
        next();
    },
    chatProxy
);

chatRouter.upgrade = chatProxy.upgrade;

export default chatRouter;
