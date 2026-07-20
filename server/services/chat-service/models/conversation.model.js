import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema(
    {
        participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, },],
        lastMessage: { type: mongoose.Schema.Types.ObjectId, ref: "Message", default: null, },
    },
    {
        timestamps: true,
    }
);

conversationSchema.path("participants").validate(function (participants) {
    return participants.length === 2;
}, "Conversation must have exactly two participants.");

conversationSchema.index({ participants: 1 });
conversationSchema.index({ updatedAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);

export default Conversation;