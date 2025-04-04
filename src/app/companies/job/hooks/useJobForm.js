// /job/hooks/useJobForm.js
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { jobSchema } from "../schemas/jobSchema";

export const useJobForm = () => {
  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      basicInfo: { title: "", location: "", salary: "" },
      requirements: { jobType: "FULL_TIME", experienceLevel: "JUNIOR" },
      description: { jobDescription: "", responsibilities: "" },
      skills: { requiredSkills: [], preferredSkills: [] },
    },
    mode: "onChange",
  });

  return form;
};