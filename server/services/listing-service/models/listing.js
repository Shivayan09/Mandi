import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, index: true, },
        title: { type: String, required: true, trim: true, maxlength: 100, },
        description: { type: String, required: true, maxlength: 3000, },
        category: { type: String, required: true, index: true, },
        subCategory: { type: String, default: "", },
        brand: { type: String, default: "", },
        condition: { type: String, enum: ["new", "like_new", "excellent", "good", "fair", "poor"], required: true, },
        price: { type: Number, required: true, min: 0, },
        negotiable: { type: Boolean, default: true, },
        images: [{ url: { type: String, required: true }, public_id: { type: String, required: true, } }],
        location: { city: { type: String, required: true, }, state: { type: String, required: true, }, country: { type: String, default: "India", }, },
        tags: [{ type: String, lowercase: true, trim: true, },],
        status: { type: String, enum: ["active", "reserved", "sold", "deleted",], default: "active", index: true, },
        views: { type: Number, default: 0, },
        favorites: { type: Number, default: 0, },
        expiresAt: { type: Date, },
    },
    {
        timestamps: true,
    }
);

listingSchema.index({ title: "text", description: "text" });
listingSchema.index({ category: 1, price: 1 });
listingSchema.index({ sellerId: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

export default mongoose.model("Listing", listingSchema);