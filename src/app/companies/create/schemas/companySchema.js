import * as z from 'zod';

const companySchema = z.object({
  name: z.string().min(1, 'Company name is required').max(100),
  industry: z.string().optional(),
  size: z.string().optional(),
  location: z.string().max(100).optional(),
  founded: z.number().min(1800).max(new Date().getFullYear()).optional().or(z.literal('')),
  website_url: z.string().url().max(200).optional().or(z.literal('')),
  country: z.string().min(1, 'Country is required'),
  contact_email: z.string().email().max(254).optional().or(z.literal('')),
  contact_phone: z.string().max(20).optional().or(z.literal('')),
  description: z.string().optional(),
  mission_statement: z.string().optional(),
  linkedin: z.string().url().max(200).optional().or(z.literal('')),
  video_introduction: z.string().url().max(200).optional().or(z.literal('')),
});

export default companySchema;