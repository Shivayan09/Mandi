import express from "express";
import upload from "../middlewares/upload.js";
import {createListing,getAllListings,getListingById,getListingsByUser,getMyListings,updateListing,deleteListing,} from "../controllers/listing.controller.js";

const listingRouter = express.Router();

listingRouter.get("/", getAllListings);
listingRouter.get("/user/:userId", getListingsByUser);
listingRouter.get("/me", getMyListings);
listingRouter.get("/:listingId", getListingById);

listingRouter.post(
    "/",
    upload.array("images", 5),
    createListing
);

listingRouter.patch(
    "/:listingId",
    upload.array("images", 5),
    updateListing
);

listingRouter.delete("/:listingId", deleteListing);

export default listingRouter;