import mongoose from "mongoose";
import { CATEGORIES } from "../config/categories.js";

const listingSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            required: [true, "User ID is required."],
            index: true,
        },
        title: {
            type: String,
            required: [true, "Title is required."],
            trim: true,
            minlength: [3, "Title must be at least 3 characters long."],
            maxlength: [100, "Title cannot exceed 100 characters."],
        },
        description: {
            type: String,
            required: [true, "Description is required."],
            trim: true,
            minlength: [10, "Description must be at least 10 characters long."],
            maxlength: [3000, "Description cannot exceed 3000 characters."],
        },
        category: {
            type: String,
            enum: CATEGORIES,
            required: [true, "Category is required."],
            trim: true,
            minlength: [3, "Category must be at least 3 characters long."],
            maxlength: [100, "Category cannot exceed 100 characters."],
            index: true,
        },
        subCategory: {
            type: String,
            trim: true,
            default: "",
            maxlength: [100, "Subcategory cannot exceed 100 characters."],
        },
        brand: {
            type: String,
            trim: true,
            default: "",
            minlength: [3, "Brand must be at least 3 characters long."],
            maxlength: [100, "Brand cannot exceed 100 characters."],
        },
        condition: {
            type: String,
            required: [true, "Condition is required."],
            enum: {
                values: ["new", "like_new", "excellent", "good", "fair", "poor"],
                message: "Invalid condition.",
            },
        },
        price: {
            type: Number,
            required: [true, "Price is required."],
            min: [0, "Price cannot be negative."],
        },
        negotiable: {
            type: Boolean,
            default: true,
        },
        images: [
            {
                url: {
                    type: String,
                    required: [true, "Image URL is required."],
                },
                public_id: {
                    type: String,
                    required: [true, "Image public ID is required."],
                },
            },
        ],
        location: {
            city: {
                type: String,
                required: [true, "City is required."],
                trim: true,
                minlength: [3, "City must be at least 3 characters long."],
                maxlength: [100, "City cannot exceed 100 characters."],
            },
            state: {
                type: String,
                required: [true, "State is required."],
                trim: true,
                minlength: [3, "State must be at least 3 characters long."],
                maxlength: [100, "State cannot exceed 100 characters."],
            },
            country: {
                type: String,
                default: "India",
                trim: true,
                minlength: [3, "Country must be at least 3 characters long."],
                maxlength: [100, "Country cannot exceed 100 characters."],
            },
        },
        tags: [
            {
                type: String,
                lowercase: true,
                trim: true,
                minlength: [2, "Each tag must be at least 2 characters long."],
                maxlength: [100, "A tag cannot exceed 100 characters."],
            },
        ],
        status: {
            type: String,
            enum: {
                values: ["active", "reserved", "sold", "deleted"],
                message: "Invalid listing status.",
            },
            default: "active",
            index: true,
        },
        views: {
            type: Number,
            default: 0,
            min: [0, "Views cannot be negative."],
        },

        favorites: {
            type: Number,
            default: 0,
            min: [0, "Favorites cannot be negative."],
        },
        expiresAt: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

listingSchema.index({ title: "text", description: "text" });
listingSchema.index({ category: 1, price: 1 });
listingSchema.index({ userId: 1, status: 1 });
listingSchema.index({ createdAt: -1 });

export default mongoose.model("Listing", listingSchema);