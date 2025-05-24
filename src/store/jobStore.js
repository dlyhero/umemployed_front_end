// src/store/jobStore.js
import { create } from 'zustand';

export const useJobStore = create((set, get) => ({
  formData: {},
  jobId: null,
  extractedSkills: [],
  isSubmittingStep1: false,
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
  setJobId: (jobId) => set({ jobId }),
  getJobId: () => get().jobId,
  setExtractedSkills: (skills) =>
    set((state) => {
      console.log('Setting extractedSkills:', skills);
      return { extractedSkills: Array.isArray(skills) ? [...skills] : [] };
    }),
  getExtractedSkills: () => get().extractedSkills,
  setIsSubmittingStep1: (isSubmitting) => set({ isSubmittingStep1: isSubmitting }),
  clearStore: () =>
    set({
      formData: {},
      jobId: null,
      extractedSkills: [],
      isSubmittingStep1: false,
    }),
}));