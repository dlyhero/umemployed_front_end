import { z } from 'zod';

export const step1Schema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters long').max(100),
  hire_number: z.number().min(1, 'Hire number must be at least 1').int(),
  job_location_type: z.enum(['remote', 'onsite', 'hybrid'], { required_error: 'Job location type is required' }),
  job_type: z.enum(['Full_time', 'Part_time', 'Internship', 'Contract'], { required_error: 'Job type is required' }),
  location: z.string().min(1, 'Location is required').max(100),
  salary_range: z.enum([
    '0-30000',
    '30001-50000',
    '50001-70000',
    '70001-100000',
    '100001-120000',
    '120001-150000',
    '150001-200000',
    '200001+',
    'Not specified',
  ]),
  category: z.number().int().min(1, 'Category is required'),
});

export const step2Schema = z.object({
  job_type: z.enum(['Full_time', 'Part_time', 'Internship', 'Contract']),
  experience_levels: z.enum(['0-1Year', '1-3Years', '3-5Years', '5-10Years', '10+Years']),
  weekly_ranges: z.enum([
    'mondayToFriday',
    'weekendsNeeded',
    'everyWeekend',
    'rotatingWeekend',
    'noWeekend',
    'weekendsOnly',
    'other',
  ]),
  shifts: z.enum([
    'morningShift',
    'dayShift',
    'eveningShift',
    'nightShift',
    '8HourShift',
    '10HourShift',
    '12HourShift',
    'other',
  ]),
});

export const step3Schema = z.object({
  description: z.string().min(10, 'Description must be at least 10 characters long').max(5000),
  responsibilities: z.string().min(10, 'Responsibilities must be at least 10 characters long').max(5000),
  benefits: z.string().min(10, 'Benefits must be at least 10 characters long').max(5000),
});

export const step4Schema = z.object({
  requirements: z.array(z.number()).min(1, 'At least one skill is required'),
  level: z.enum(['Beginner', 'Mid', 'Senior']),
});

export const jobSchema = z.object({
  ...step1Schema.shape,
  ...step2Schema.shape,
  ...step3Schema.shape,
  ...step4Schema.shape,
});