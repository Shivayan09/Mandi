import axios from "axios";
import Listing from "../models/listing.js";
import uploadImage from "../utils/uploadImage.js";
import cloudinary from "../config/cloudinary.js";
import { CATEGORIES } from "../config/categories.js";
import redis from "../config/redis.js";

async function fetchSellerProfile(userId) {
    try {
        const response = await axios.get(`${process.env.USER_SERVICE_URL}/users/${userId}`, {
            headers: { Accept: "application/json" },
        });
        const profile = response.data?.user ?? response.data;
        if (!profile) return null;
        return {
            userId: String(profile.userId ?? userId),
            name: profile.name ?? `Seller ${String(userId).slice(-4)}`,
        };
    } catch {
        return {
            userId: String(userId),
            name: `Seller ${String(userId).slice(-4)}`,
        };
    }
}

async function attachSeller(listing) {
    if (!listing) return null;
    const plainListing = typeof listing.toObject === "function" ? listing.toObject() : listing;
    const seller = await fetchSellerProfile(String(plainListing.userId));
    return { ...plainListing, seller };
}

async function attachSellers(listings) {
    const uniqueUserIds = [...new Set(listings.map((listing) => String(listing.userId)))];
    const sellerEntries = await Promise.all(
        uniqueUserIds.map(async (userId) => [userId, await fetchSellerProfile(userId)]),
    );
    const sellerMap = new Map(sellerEntries);
    return listings.map((listing) => {
        const plainListing = typeof listing.toObject === "function" ? listing.toObject() : listing;
        return { ...plainListing, seller: sellerMap.get(String(plainListing.userId)) };
    });
}


export const createListing = async (req, res) => {
    try {
        const userId = req.user.userId;
        let { title, description, category, subCategory, brand, condition, price, negotiable, tags, expiresAt } = req.body;
        const location = typeof req.body.location === "string" ? JSON.parse(req.body.location) : req.body.location;
        if (!title || !description || !category || !condition || !price || !location) {
            return res.status(400).json({
                success: false,
                message: "Please provide all required fields!"
            });
        }
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "At least one image is required!"

            });
        }
        if (!CATEGORIES.includes(category)) {
            return res.status(400).json({
                success: false,
                message: "Invalid category!"

            });
        }
        const uploadedImages = [];
        for (const file of req.files) {
            const uploaded = await uploadImage(file);
            uploadedImages.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
        }
        const listing = await Listing.create({ userId, title, description, category, subCategory, brand, condition, price, negotiable, images: uploadedImages, location, tags, expiresAt });
        const hydratedListing = await attachSeller(listing);
        await redis.del("listings:all");
        await redis.del(`listings:user:${userId}`);
        return res.status(201).json({
            success: true,
            message: "Listing created successfully!",
            listing: hydratedListing
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
            message: "Failed to create listing!"
        });
    }
};

export const getAllListings = async (req, res) => {
    try {
        const cacheKey = "listings:all";
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const listings = await Listing.find({ status: "active" }).sort({ createdAt: -1 });
        const hydratedListings = await attachSellers(listings);
        const responseData = { success: true, count: hydratedListings.length, listings: hydratedListings };
        await redis.setEx(cacheKey, 3600, JSON.stringify(responseData));
        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch listings!"
        });
    }
};

export const getListingById = async (req, res) => {
    try {
        const { listingId } = req.params;
        const cacheKey = `listing:${listingId}`;
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            Listing.findByIdAndUpdate(listingId, { $inc: { views: 1 } }).exec();
            return res.status(200).json(JSON.parse(cachedData));
        }
        const listing = await Listing.findOneAndUpdate(
            { _id: listingId, status: "active" },
            { $inc: { views: 1 } },
            { new: true }
        );
        if (!listing) {
            return res.status(404).json({
                success: false,
                message: "Listing not found!"
            });
        }
        const hydratedListing = await attachSeller(listing);
        const responseData = { success: true, listing: hydratedListing };
        await redis.setEx(cacheKey, 1800, JSON.stringify(responseData));
        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch listing!"
        });
    }
};

export const getListingsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const cacheKey = `listings:user:${userId}`;
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const listings = await Listing.find({ userId, status: { $ne: "deleted" } }).sort({ createdAt: -1 });
        const hydratedListings = await attachSellers(listings);
        const responseData = { success: true, count: hydratedListings.length, listings: hydratedListings };
        await redis.setEx(cacheKey, 3600, JSON.stringify(responseData));
        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user listings!"
        });
    }
};

export const getMyListings = async (req, res) => {
    try {
        const userId = req.user.userId;
        const cacheKey = `listings:user:${userId}`;
        const cachedData = await redis.get(cacheKey);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const listings = await Listing.find({ userId, status: { $ne: "deleted" } }).sort({ createdAt: -1 });
        const hydratedListings = await attachSellers(listings);
        const responseData = { success: true, count: hydratedListings.length, listings: hydratedListings };
        await redis.setEx(cacheKey, 3600, JSON.stringify(responseData));
        return res.status(200).json(responseData);
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch your listings!"
        });
    }
};

export const updateListing = async (req, res) => {
    try {
        const { listingId } = req.params;
        const listing = await Listing.findById(listingId);
        if (!listing) return res.status(404).json({
            success: false,
            message: "Listing not found!"
        });
        if (listing.userId.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized!"
            });
        }
        const updates = { ...req.body };
        if (typeof updates.location === "string") updates.location = JSON.parse(updates.location);
        if (req.files && req.files.length > 0) {
            const uploadedImages = [];
            for (const file of req.files) {
                const uploaded = await uploadImage(file);
                uploadedImages.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
            }
            updates.images = uploadedImages;
        }
        const updatedListing = await Listing.findByIdAndUpdate(listingId, updates, { new: true, runValidators: true });
        const hydratedListing = await attachSeller(updatedListing);
        await redis.del(`listing:${listingId}`);
        await redis.del("listings:all");
        await redis.del(`listings:user:${listing.userId}`);
        return res.status(200).json({
            success: true,
            message: "Listing updated successfully!",
            listing: hydratedListing
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update listing!"
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
                message: "Listing not found!"
            });
        }
        if (listing.userId.toString() !== req.user.userId) {
            return res.status(403).json({
                success: false,
                message: "Unauthorized!"
            });
        }
        for (const image of listing.images) {
            try {
                await cloudinary.uploader.destroy(image.public_id);
            } catch { }
        }
        listing.status = "deleted";
        await listing.save();
        await redis.del(`listing:${listingId}`);
        await redis.del("listings:all");
        await redis.del(`listings:user:${listing.userId}`);
        return res.status(200).json({
            success: true,
            message: "Listing deleted successfully!"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete listing!"
        });
    }
}