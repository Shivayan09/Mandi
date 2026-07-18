import { Router } from "express";
import { createProxyMiddleware, fixRequestBody } from "http-proxy-middleware";

const listingRouter = Router();

listingRouter.use(
    "/",
    createProxyMiddleware({
        target: process.env.LISTING_SERVICE_URL,
        changeOrigin: true,
        pathRewrite: {
            "^/": "/listing/",
        },
        on: {
            proxyReq: (proxyReq, req) => {
                fixRequestBody(proxyReq, req);
                if (req.user) {
                    proxyReq.setHeader(
                        "x-user",
                        JSON.stringify(req.user)
                    );
                }
            }
        }
    }),
);

export default listingRouter;
