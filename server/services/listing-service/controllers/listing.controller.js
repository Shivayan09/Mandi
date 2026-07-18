import Listing from "../models/listing.js";
import uploadImage from "../utils/uploadImage.js";
import cloudinary from "../config/cloudinary.js";

export const createListing = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { title, description, category, subCategory, brand, condition, price, negotiable, tags, expiresAt } = req.body;
        const location = typeof req.body.location === "string" ? JSON.parse(req.body.location) : req.body.location;
        if (!title || !description || !category || !condition || !price || !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields!",
            });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required!",
            });
        }
        const uploadedImages = [];
        for (const file of req.files) {
            const uploaded = await uploadImage(file);
            uploadedImages.push({
                url: uploaded.secure_url,
                public_id: uploaded.public_id,
            });

        }
        const listing = await Listing.create({ userId, title, description, category, subCategory, brand, condition, price, negotiable, images: uploadedImages, location, tags, expiresAt, });
        return res.status(201).json({
            success: true,
            message: "Listing created successfully!",
            listing,
        });
    } catch (error) {
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({
                success: false,
                message: errors[0]
            });
        }
        return res.status(500).json({
            success: false,
            message: "Failed to create listing!",
        });
    }
};

export const getAllListings = async (req, res) => {
    try {
        const listings = await Listing.find({ status: "active" }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: listings.length,
            listings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch listings!",
        });
    }
};

export const getListingById = async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findOneAndUpdate({ _id: listingId, status: "active", }, { $inc: { views: 1 } }, { new: true });
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found!",
            });
        }
        return res.status(200).json({
            success: true,
            listing,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch listing!",
        });
    }
};

export const getListingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const listings = await Listing.find({ userId, status: { $ne: "deleted" }, }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: listings.length,
            listings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user listings!",
        });
    }
};

export const getMyListings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const listings = await Listing.find({ userId, status: { $ne: "deleted" }, }).sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            count: listings.length,
            listings,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your listings!",
        });
    }
};

export const updateListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found!",
            });
        }
        if (listing.userId.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this listing!",
            });
        }
        const updatedListing = await Listing.findByIdAndUpdate(listingId, req.body, { new: true, runValidators: true });
        return res.status(200).json({
            success: true,
            message: "Listing updated successfully!",
            listing: updatedListing,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update listing!",
        });
    }
};

export const deleteListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId);
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found!",
            });
        }
        if (listing.userId.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this listing!",
            });
        }
        for (const image of listing.images) {
            try {
                await cloudinary.uploader.destroy(image.public_id);
            } catch { }
        }
        listing.status = "deleted";
        await listing.save();
        return res.status(200).json({
            success: true,
            message: "Listing deleted successfully!",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete listing!",
        });
    }
};