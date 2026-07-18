import "./config/env.js";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/db.js";
import listingRouter from "./routes/listing.routes.js";
import { injectUser } from "./middlewares/injectUser.js";

const app = express();

connectDB();

app.use(express.json());

app.use(injectUser);

app.use("/listing", listingRouter);

app.get("/", (req, res) => {
    res.send("Listing Service Running");
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
    console.log(`Listing Service running on port ${PORT}`);
});
