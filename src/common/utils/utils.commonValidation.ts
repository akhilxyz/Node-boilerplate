import { z } from "zod";

// Common validations
export const commonValidations = {
  id: z
    .string()
    .refine((data) => !Number.isNaN(Number(data)), { message: "ID must be a numeric value" })
    .transform((data) => Number(data))
    .refine((num) => num > 0, { message: "ID must be a positive number" }),
  // ... other common validations
};

// Define headers schema
export const HeadersSchema = z.object({
  "Content-Type": z.string().optional(), // Example: Content-Type header is optional
  "api-access-token": z.string({
    invalid_type_error: "Invalid api-access-token",
    required_error: "api-access-token is required",
  }), // Example:
});

// Zod schema for a single file upload
export const fileSchema = z.object({
  fieldname: z.string(),       // Field name specified in the form
  originalname: z.string(),    // Original name of the uploaded file
  encoding: z.string(),        // File encoding type (e.g., '7bit')
  mimetype: z.string(),        // MIME type of the file (e.g., 'image/png')
  size: z.number().max(5 * 1024 * 1024), // File size (max 5MB for this example)
  destination: z.string(),     // Destination folder where the file is saved
  filename: z.string(),        // Name of the file saved on the server
  path: z.string(),            // Full path to the uploaded file
  buffer: z.any().optional(),  // Optional buffer if file is not stored in memory
});


// Zod schema for validating request body
export const fileUploadBodySchema = z.object({
  file: z
  .instanceof(Buffer)
  .or(z.array(z.instanceof(Buffer))) // File or files from FormData (buffers in the case of multer)
  .optional(),
  files: z
  .instanceof(Buffer)
  .or(z.array(z.instanceof(Buffer))) // File or files from FormData (buffers in the case of multer)
  .optional(),});

// Zod schema to validate query parameters
export const paginationSchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1)) // Default to 1 if not provided
    .refine((val) => !isNaN(val) && val > 0, { message: "Page must be a positive number" }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 10)) // Default to 10 if not provided
    .refine((val) => !isNaN(val) && val > 0, { message: "Limit must be a positive number" }),
});