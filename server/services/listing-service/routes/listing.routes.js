import express from "express";
import upload from "../middlewares/upload.js";
import { createListing, getAllListings, getListingById, getListingsByUser, getMyListings, updateListing, deleteListing, } from "../controllers/listing.controller.js";
import { verifyJWT } from "../middlewares/middleware.js";

const listingRouter = express.Router();

listingRouter.get("/", getAllListings);
listingRouter.get("/user/:userId", verifyJWT, getListingsByUser);
listingRouter.get("/me", verifyJWT, getMyListings);
listingRouter.get("/:listingId", getListingById);
listingRouter.post("/", upload.array("images", 5), verifyJWT, createListing);
listingRouter.patch("/:listingId", upload.array("images", 5), verifyJWT, updateListing);
listingRouter.delete("/:listingId", verifyJWT, deleteListing);

export default listingRouter;
