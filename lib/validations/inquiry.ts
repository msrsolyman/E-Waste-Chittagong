import { z } from "zod";

export const inquirySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  companyName: z.string().min(2, "Company name is required").max(150),
  email: z.string().email("Invalid business email address"),
  phoneOrWhatsApp: z.string().max(50).optional().nullable(),
  country: z.string().min(2, "Please select or enter your country"),
  interestedCategory: z.string().optional().nullable(),
  estimatedQty: z.string().max(100).optional().nullable(),
  message: z.string().min(10, "Message must be at least 10 characters").max(3000),
  productId: z.string().optional().nullable(),
  // Honeypot field for spam bots
  website_field_hp: z.string().max(0, "Bot detected").optional(),
});

export type InquiryInput = z.infer<typeof inquirySchema>;
