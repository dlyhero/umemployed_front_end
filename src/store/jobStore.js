import { create } from 'zustand';

export const useJobStore = create((set, get) => ({
  formData: {},
  extractedSkills: [],
  isSubmittingStep1: false,
  setFormData: (data) => set((state) => ({ formData: { ...state.formData, ...data } })),
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
      extractedSkills: [],
      isSubmittingStep1: false,
    }),
}));