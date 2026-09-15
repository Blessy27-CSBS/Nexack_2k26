import Partner from '../models/Partner.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all partners
// @route   GET /api/partners
// @access  Public
export const getPartners = async (req, res) => {
    try {
        const partners = await Partner.find({});
        res.json(partners);
    } catch (error) {
        console.error("Get Partners Error:", error);
        res.status(500).json({ message: 'Failed to fetch partners', error: error.message });
    }
};

// @desc    Create a partner
// @route   POST /api/partners
// @access  Private/Admin
export const createPartner = async (req, res) => {
    try {
        console.log("Uploaded file:", req.file);

        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }

        const { name, website } = req.body;
        let logo = '';

        if (req.file) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/partners'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    return res.status(500).json({ message: "Cloudinary upload failed" });
                }

                // 3. Save the Cloudinary secure URL to MongoDB
                logo = cloudinaryResult.secure_url;

                // 5. After uploading, delete the temporary Multer file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Logo upload to Cloudinary failed: ' + uploadError.message });
            }
        }

        if (!name) {
            return res.status(400).json({ message: 'Please provide partner name' });
        }

        const createdPartner = await Partner.create({
            name,
            logo,
            website
        });

        res.status(201).json(createdPartner);
    } catch (error) {
        console.error("Create Partner Error:", error);
        res.status(500).json({ message: 'Partner creation failed', error: error.message });
    }
};

// @desc    Update a partner
// @route   PUT /api/partners/:id
// @access  Private/Admin
export const updatePartner = async (req, res) => {
    try {

        console.log("==== UPDATE PARTNER START ====");
        console.log("Params:", req.params);
        console.log("Body:", req.body);
        console.log("File:", req.file);

        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Partner ID missing" });
        }

        const partner = await Partner.findById(id);

        if (!partner) {
            return res.status(404).json({ message: "Partner not found" });
        }

        if (req.body.name !== undefined) {
            partner.name = req.body.name;
        }

        if (req.body.website !== undefined) {
            partner.website = req.body.website;
        }

        if (req.file && req.file.path) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/partners'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    return res.status(500).json({ message: "Cloudinary update failed" });
                }

                // 3. Save the Cloudinary secure URL to MongoDB
                partner.logo = cloudinaryResult.secure_url;

                // 5. After uploading, delete the temporary Multer file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Logo update to Cloudinary failed: ' + uploadError.message });
            }
        }

        await partner.save();

        console.log("Partner updated successfully");

        return res.status(200).json({
            success: true,
            message: "Partner updated",
            partner
        });

    } catch (error) {

        console.error("UPDATE PARTNER ERROR:", error);

        return res.status(500).json({
            success: false,
            message: "Update failed",
            error: error.message
        });
    }
};

// @desc    Delete a partner
// @route   DELETE /api/partners/:id
// @access  Private/Admin
export const deletePartner = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid partner ID format' });
        }

        const partner = await Partner.findById(id);

        if (!partner) {
            return res.status(404).json({ message: 'Partner not found' });
        }

        // No local file deletion needed for Cloudinary storage

        await partner.deleteOne();
        res.json({ message: 'Partner removed successfully' });
    } catch (error) {
        console.error("Delete Partner Error:", error);
        res.status(500).json({ message: 'Failed to delete partner', error: error.message });
    }
};
