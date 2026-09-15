import StaffCoordinator from '../models/StaffCoordinator.js';
import mongoose from 'mongoose';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

export const getStaff = async (req, res) => {
    try {
        const staff = await StaffCoordinator.find({});
        res.json(staff);
    } catch (error) {
        console.error("Get Staff Error:", error);
        res.status(500).json({ message: 'Failed to fetch staff', error: error.message });
    }
};

export const addStaff = async (req, res) => {
    try {
        if (!req.body) {
            return res.status(400).json({ message: 'Request body is missing' });
        }
        const { name, designation, department } = req.body;
        if (!name || !designation) {
            return res.status(400).json({ message: 'Name and designation are required' });
        }
        let photo = '';

        if (req.file) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/staff'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    throw new Error("Cloudinary upload failed to return a secure URL");
                }

                // 3. Save the Cloudinary secure URL to MongoDB
                photo = cloudinaryResult.secure_url;

                // 5. After uploading, delete the temporary Multer file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Photo upload to Cloudinary failed: ' + uploadError.message });
            }
        }

        if (!photo) {
            return res.status(400).json({ message: 'Staff photo is required' });
        }

        const createdStaff = await StaffCoordinator.create({
            name,
            designation,
            department,
            photo
        });

        res.status(201).json(createdStaff);
    } catch (error) {
        console.error("Add Staff Error:", error);
        res.status(500).json({ message: 'Failed to add staff', error: error.message });
    }
};

export const updateStaff = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        const staff = await StaffCoordinator.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        if (req.body) {
            if (req.body.name) staff.name = req.body.name;
            if (req.body.designation) staff.designation = req.body.designation;
            if (req.body.department !== undefined) staff.department = req.body.department;
        }

        if (req.file) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/staff'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    throw new Error("Cloudinary update failed to return a secure URL");
                }

                // 3. Save the Cloudinary secure URL to MongoDB
                staff.photo = cloudinaryResult.secure_url;

                // 5. After uploading, delete the temporary Multer file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'Photo update to Cloudinary failed: ' + uploadError.message });
            }
        }

        const updatedStaff = await staff.save();
        res.json(updatedStaff);
    } catch (error) {
        console.error("Update Staff Error:", error);
        res.status(500).json({ message: 'Failed to update staff', error: error.message });
    }
};

export const deleteStaff = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid staff ID format' });
        }

        const staff = await StaffCoordinator.findById(id);
        if (!staff) {
            return res.status(404).json({ message: 'Staff not found' });
        }

        await staff.deleteOne();
        res.json({ message: 'Staff removed successfully' });
    } catch (error) {
        console.error("Delete Staff Error:", error);
        res.status(500).json({ message: 'Failed to delete staff', error: error.message });
    }
};
