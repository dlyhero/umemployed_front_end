// /job/hooks/useJobForm.js
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { jobSchema } from '../app/companies/job/schemas/jobSchema';

export const useJobForm = () => {
  const [step, setStep] = useState(1);

  const form = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: {
      title: '',
      country: '',
      salary: '',
      jobTypes: [],
      experienceLevel: [],
      weeklyRange: [],
      shift: [],
      description: '',
      responsibilities: '',
      benefits: '',
      skills: [],
    },
    mode: 'onChange',
  });

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 4));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  // Custom validation for the current step
  const stepIsValid = () => {
    const errors = form.formState.errors;

    if (step === 1) {
      // Step 1: Check title and country
      return !errors.title && !errors.country;
    } else if (step === 2) {
      // Step 2: Check Step 1 fields + jobTypes, experienceLevel, weeklyRange, shift
      return (
        !errors.title &&
        !errors.country &&
        !errors.jobTypes &&
        !errors.experienceLevel &&
        !errors.weeklyRange &&
        !errors.shift
      );
    } else if (step === 3) {
      // Step 3: Check Step 1, Step 2 fields + description, responsibilities, benefits
      return (
        !errors.title &&
        !errors.country &&
        !errors.jobTypes &&
        !errors.experienceLevel &&
        !errors.weeklyRange &&
        !errors.shift &&
        !errors.description &&
        !errors.responsibilities &&
        !errors.benefits
      );
    } else if (step === 4) {
      // Step 4: Check all fields
      return form.formState.isValid;
    }
    return false;
  };

  return { step, setStep, form, nextStep, prevStep, stepIsValid };
};