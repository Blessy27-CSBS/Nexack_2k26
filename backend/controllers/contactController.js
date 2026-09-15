import Contact from '../models/Contact.js';
import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const getContacts = async (req, res) => {
    try {
        const contacts = await Contact.find({}).sort({ createdAt: -1 });
        res.json(contacts);
    } catch (error) {
        console.error("Get Contacts Error:", error);
        res.status(500).json({
            message: "Failed to fetch contacts",
            error: error.message
        });
    }
};

export const createContact = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: "Request body is missing" });
        }

        const { name, link } = req.body;
        let logo = '';

        if (req.file) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/contacts'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    throw new Error("Cloudinary upload failed to return a secure URL");
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

        if (!logo) {
            return res.status(400).json({ message: 'Logo is required for new contacts' });
        }

        if (!name || !link) {
            return res.status(400).json({ message: 'Name and link are required' });
        }

        const contact = new Contact({
            name,
            link,
            logo
        });

        const createdContact = await contact.save();
        res.status(201).json(createdContact);
    } catch (error) {
        console.error("Create Contact Error:", error);
        res.status(500).json({
            message: "Failed to create contact",
            error: error.message
        });
    }
};

export const updateContact = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate ObjectId
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid contact ID format" });
        }

        const updateData = {};

        // Handle text fields
        if (req.body) {
            if (req.body.name) updateData.name = req.body.name;
            if (req.body.link) updateData.link = req.body.link;
        }

        // Handle file upload
        if (req.file) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/contacts'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    throw new Error("Cloudinary update failed to return a secure URL");
                }

                // 3. Save the Cloudinary secure URL to MongoDB
                updateData.logo = cloudinaryResult.secure_url;

                // 5. After uploading, delete the temporary Multer file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Logo update to Cloudinary failed: ' + uploadError.message });
            }
        }

        // Find and update
        const updatedContact = await Contact.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        );

        if (!updatedContact) {
            return res.status(404).json({ message: "Contact not found" });
        }

        res.json(updatedContact);

    } catch (error) {
        console.error("Update Contact Error:", error);
        res.status(500).json({
            message: "Failed to update contact",
            error: error.message
        });
    }
};

export const deleteContact = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "Invalid contact ID format" });
        }

        const contact = await Contact.findById(id);
        if (!contact) {
            return res.status(404).json({ message: 'Contact not found' });
        }

        // No local file deletion needed for Cloudinary storage

        await contact.deleteOne();
        res.json({ message: 'Contact removed successfully' });

    } catch (error) {
        console.error("Delete Contact Error:", error);
        res.status(500).json({
            message: "Failed to delete contact",
            error: error.message
        });
    }
};
