import express from 'express';
import PaymentQR from '../models/PaymentQR.js';
import upload from '../middleware/uploadMiddleware.js';
import cloudinary from '../config/cloudinary.js';
import fs from 'fs';

const router = express.Router();

// POST — save image + text (replace any existing record)
router.post('/', upload.single('image'), async (req, res) => {
    try {
        if (req.file) {
            try {
                // 1. Upload the temporary file to Cloudinary immediately after receiving it
                // We use Multer diskStorage so the file is available at req.file.path
                const cloudinaryResult = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'znexus/payment'
                });

                // 6. Add logging to verify the Cloudinary URL before saving
                console.log("Uploaded Image URL:", cloudinaryResult.secure_url);

                // Validation: Stop if Cloudinary didn't return a secure_url
                if (!cloudinaryResult || !cloudinaryResult.secure_url) {
                    return res.status(500).json({ message: "Image upload failed: Cloudinary did not return a secure URL" });
                }

                // 5. After uploading, delete the temporary Multer file
                if (fs.existsSync(req.file.path)) {
                    fs.unlinkSync(req.file.path);
                }

                // Clear existing records before creating new one
                await PaymentQR.deleteMany({});

                // 3 & 4. Save the Cloudinary secure URL in MongoDB ONLY after the Cloudinary upload completes
                const qr = await PaymentQR.create({
                    image: cloudinaryResult.secure_url,
                    text: req.body.text || ''
                });

                return res.json(qr);
            } catch (uploadError) {
                console.error("Cloudinary Upload Error:", uploadError);
                return res.status(500).json({ message: 'QR upload failed: ' + uploadError.message });
            }
        }

        // Handle case where NO new image is uploaded (Update Text Only)
        // Ensure we still have an image to save
        const existing = await PaymentQR.findOne();
        if (!existing || !existing.image) {
            return res.status(400).json({ message: "QR image is required. Please upload an image." });
        }

        const text = req.body.text || '';
        await PaymentQR.deleteMany({});

        const updatedRecord = await PaymentQR.create({
            image: existing.image,
            text
        });

        res.json(updatedRecord);
    } catch (error) {
        console.error('PaymentQR save error:', error.message);
        res.status(500).json({ message: 'Save failed: ' + error.message });
    }
});

// GET — return current record
router.get('/', async (req, res) => {
    try {
        const qr = await PaymentQR.findOne();
        res.json(qr || { image: '', text: '' });
    } catch (error) {
        console.error('PaymentQR fetch error:', error.message);
        res.status(500).json({ message: 'Fetch failed' });
    }
});

export default router;
