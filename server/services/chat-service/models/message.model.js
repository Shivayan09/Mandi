import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        conversation: { type: mongoose.Schema.Types.ObjectId, ref: "Conversation", required: true, index: true, },
        sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },
        text: { type: String, trim: true, required: true, maxlength: 5000, },
        read: { type: Boolean, default: false, },
    },
    {
        timestamps: true,
    }
);

messageSchema.index({ conversation: 1, createdAt: 1, });

const Message = mongoose.model("Message", messageSchema);

export default Message;