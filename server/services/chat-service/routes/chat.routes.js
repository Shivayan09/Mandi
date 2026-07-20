import { Router } from "express";
import { createConversation, getConversations, getMessages } from "../controllers/chat.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/conversations", verifyJWT, createConversation);
router.get("/conversations", verifyJWT, getConversations);
router.get("/conversations/:conversationId/messages", verifyJWT, getMessages);

export default router;
