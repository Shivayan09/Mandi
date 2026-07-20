import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getIO } from "../socket/socket.js";

function getUserServiceBaseUrl() {
    return (process.env.USER_SERVICE_URL || "http://localhost:5000").replace(/\/+$/, "");
}

async function fetchUserProfile(userId) {
    try {
        const response = await fetch(`${getUserServiceBaseUrl()}/users/${userId}`, {
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            return null;
        }

        const data = await response.json();
        return data.user ?? null;
    } catch {
        return null;
    }
}

async function hydrateConversation(conversation) {
    if (!conversation) return null;

    const plainConversation = typeof conversation.toObject === "function"
        ? conversation.toObject()
        : conversation;

    const participants = await Promise.all(
        (plainConversation.participants ?? []).map(async (participantId) => {
            const profile = await fetchUserProfile(String(participantId));
            return profile ?? {
                userId: String(participantId),
                name: `User ${String(participantId).slice(-4)}`,
            };
        }),
    );

    return {
        ...plainConversation,
        participants,
    };
}

export const createConversation = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const { receiverId } = req.body;
        if (!receiverId) {
            return res.status(400).json({
                success: false,
                message: "Receiver ID is required",
            });
        }
        if (senderId === receiverId) {
            return res.status(400).json({
                success: false,
                message: "You cannot chat with yourself",
            });
        }
        const participants = [senderId, receiverId].map(String).sort();
        let conversation = await Conversation.findOne({ participants });
        if (!conversation) {
            conversation = await Conversation.create({ participants });
            const io = getIO();
            if (io) {
                io.to(`user:${receiverId}`).emit("conversation:new", conversation);
            }
        }
        conversation = await Conversation.findById(conversation._id).populate("lastMessage");
        conversation = await hydrateConversation(conversation);
        return res.status(200).json({
            success: true,
            conversation,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server Error!",
        });
    }
};

export const getConversations = async (req, res) => {
    try {
        const userId = req.user.userId;
        const conversations = await Conversation.find({ participants: userId, })
            .populate("lastMessage")
            .sort({ updatedAt: -1 });
        const hydratedConversations = await Promise.all(conversations.map(hydrateConversation));
        res.status(200).json({
            success: true,
            conversations: hydratedConversations,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};

export const getMessages = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { conversationId } = req.params;
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 30;
        const conversation = await Conversation.findOne({
            _id: conversationId,
            participants: userId,
        });
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation not found",
            });
        }
        const messages = await Message.find({ conversation: conversationId, }).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);
        res.status(200).json({
            success: true,
            messages,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
};
