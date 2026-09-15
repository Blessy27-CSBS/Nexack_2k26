import multer from 'multer';
import path from 'path';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage on disk before optional upload to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const cleanName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, `${cleanName}-${uniqueSuffix}${ext}`);
  }
});

// Allowed file types: images and documents
const allowedImageTypes = /jpeg|jpg|png|webp|svg/;
const allowedDocTypes = /pdf|ppt|pptx|zip/;

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const isImage = allowedImageTypes.test(ext);
  const isDoc = allowedDocTypes.test(ext);

  if (isImage || isDoc) {
    return cb(null, true);
  }
  return cb(new Error('Invalid file format. Allowed: JPG, PNG, WEBP, PDF, PPT, ZIP'), false);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 15 * 1024 * 1024 } // 15MB limit
});

// Helper to upload a local file to Cloudinary if configured, else return relative path
export const processFileUpload = async (file, folder = 'nexack') => {
  if (!file) return { url: '', publicId: '' };

  const hasCloudinary = Boolean(
    process.env.CLOUDINARY_NAME &&
    process.env.CLOUDINARY_KEY &&
    process.env.CLOUDINARY_SECRET
  );

  if (hasCloudinary) {
    try {
      const isDoc = /pdf|ppt|pptx|zip/.test(path.extname(file.originalname).toLowerCase());
      const result = await cloudinary.uploader.upload(file.path, {
        folder: `nexack/${folder}`,
        resource_type: isDoc ? 'raw' : 'auto'
      });

      // Remove local temp file
      if (fs.existsSync(file.path)) {
        fs.unlinkSync(file.path);
      }

      return {
        url: result.secure_url,
        publicId: result.public_id
      };
    } catch (err) {
      console.warn('Cloudinary upload fallback to local storage:', err.message);
    }
  }

  // Fallback to local storage path
  const normalizedPath = `/uploads/${path.basename(file.path)}`;
  return {
    url: normalizedPath,
    publicId: path.basename(file.path)
  };
};

export default upload;
