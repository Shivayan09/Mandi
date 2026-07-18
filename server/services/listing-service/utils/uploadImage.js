import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

const uploadImage = (file) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "Mandi/listings",
                resource_type: "image",
            },
            (error, result) => {
                if (error) return reject(error);
                resolve(result);
            }
        );

        streamifier.createReadStream(file.buffer).pipe(stream);
    });
};

export default uploadImage;