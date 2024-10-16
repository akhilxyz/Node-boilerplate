import fs from 'fs';
import path from 'path';
import multer from 'multer';
import { z } from 'zod';
import { NextFunction , Request ,Response } from 'express';

// Zod schema for upload validation
export const uploadSchema = z.object({
    isMultiple: z.string().optional().default('false').refine((val) => val === 'true' || val === 'false', {
      message: 'isMultiple must be a boolean value represented as a string',
    }),
  });
// Set the destination for uploaded files
const uploadDir = path.join(__dirname,'../../uploads');

// Create uploads directory if it doesn't exist
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure multer for single and multiple file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Set the destination to the uploads folder
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname); // Append a unique suffix to the filename
  }
});

// Create multer instance
const upload = multer({ storage });

// Middleware to handle single and multiple file uploads
const uploadMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Validate request body
  try {
    const validatedData = uploadSchema.parse(req.body);
    
    if (req.files) {
      // If files are already attached to the request
      return next();
    }

    // Check if the request is for single or multiple file upload
    const isMultiple = validatedData.isMultiple === 'true';

    if (isMultiple) {
      upload.array('files')(req, res, next); // Upload multiple files
    } else {
      upload.single('file')(req, res, next); // Upload single file
    }
  } catch (error :any) {
    return res.status(400).json({
      message: 'Validation error',
      errors: error.errors,
    });
  }
};

export default uploadMiddleware;
