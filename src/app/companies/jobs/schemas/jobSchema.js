import { z } from 'zod';

export const step1Schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(100),
  hire_number: z.number().min(1, 'Hire number must be at least 1').int(),
  job_type: z.string().min(1, 'Job type is required'),
  job_location_type: z.string().min(1, 'Job location type is required'),
  location: z.string().length(2, 'Location must be a 2-letter country code'),
  salary_range: z.string().min(1, 'Salary range is required'),
  category: z.number().int().min(1, 'Category is required'),
});

export const step2Schema = z.object({
  job_type: z.string().min(1, 'Job type is required'),
  experience_levels: z.string().min(1, 'Experience level is required'),
  weekly_ranges: z.string().min(1, 'Weekly range is required'),
  shifts: z.string().min(1, 'Shift is required'),
});

export const step3Schema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long').max(5000),
  responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters long').max(5000),
  benefits: z.string().min(10, 'Benefits must be at least 10 characters long').max(5000),
});

export const step4Schema = z.object({
  requirements: z
    .array(z.number())
    .min(1, 'At least one skill is required')
    .max(5, 'You can select up to 5 skills only'), // Add max 5 validation
  level: z.enum(['Beginner', 'Mid', 'Senior'], {
    required_error: 'Experience level is required',
  }),
});

export const jobSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});