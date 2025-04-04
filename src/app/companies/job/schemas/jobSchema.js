// /job/schemas/jobSchema.js
import { z } from "zod";

export const jobSchema = z.object({
  basicInfo: z.object({
    title: z.string().min(1, "Job title is required"),
    location: z.string().min(1, "Location is required"),
    salary: z.string().min(1, "Salary is required"),
  }),
  requirements: z.object({
    jobType: z.enum(["FULL_TIME", "PART_TIME", "CONTRACT"]),
    experienceLevel: z.enum(["JUNIOR", "MID", "SENIOR"]),
  }),
  description: z.object({
    jobDescription: z.string().min(10, "Description must be at least 10 characters"),
    responsibilities: z.string().min(10, "Responsibilities must be at least 10 characters"),
  }),
  skills: z.object({
    requiredSkills: z.array(z.string()).min(1, "At least one skill is required"),
    preferredSkills: z.array(z.string()).optional(),
  }),
});