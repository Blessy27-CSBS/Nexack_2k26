import Gallery from '../models/Gallery.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getGallery = async (req, res) => {
    try {
        const galleryItems = await Gallery.find({}).sort({ createdAt: -1 });
        res.json(galleryItems);
    } catch (error) {
        console.error("Get Gallery Error:", error);
        res.status(500).json({ message: 'Failed to fetch gallery', error: error.message });
    }
};

export const addGalleryImage = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        const { title } = req.body;
        let imageUrl = '';

        if (req.file) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/gallery'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    return res.status(500).json({ message: "Cloudinary upload failed" });
                }

                // 3. Save the Cloudinary secure URL to MongoDB
                imageUrl = cloudinaryResult.secure_url;

                // 5. After uploading, delete the temporary Multer file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Image upload to Cloudinary failed: ' + uploadError.message });
            }
        }

        if (!imageUrl) {
            return res.status(400).json({ message: 'Image file is required' });
        }

        if (!title || title.trim() === '') {
            return res.status(400).json({ message: 'Image title is required' });
        }

        const createdItem = await Gallery.create({
            title: title.trim(),
            imageUrl
        });

        res.status(201).json(createdItem);
    } catch (error) {
        console.error("Add Gallery Image Error:", error);
        res.status(500).json({ message: 'Failed to upload image', error: error.message });
    }
};

export const deleteGalleryImage = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid image ID format' });
        }

        const item = await Gallery.findById(id);
        if (!item) {
            return res.status(404).json({ message: 'Image not found' });
        }

        // No local file deletion needed for Cloudinary storage

        await item.deleteOne();
        res.json({ message: 'Image removed successfully' });
    } catch (error) {
        console.error("Delete Gallery Image Error:", error);
        res.status(500).json({ message: 'Failed to delete image', error: error.message });
    }
};
