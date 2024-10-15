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