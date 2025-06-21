// src/app/companies/jobs/create/description/page.jsx
'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';
import { TailoredDescriptionModal } from '../../components/TailoredDescriptionModal';
import { Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

function DescriptionInner() {
  const currentStep = 'description';
  const router = useRouter();
  const searchParams = useSearchParams();
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions, extractedSkills, isLoadingOptions, isLoadingSkills, jobId, generateTailoredDescription, isGeneratingDescription } = useJobForm(currentStep);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (!jobId) {
      console.warn('No jobId for description step, redirecting to basicinformation');
      toast.error('Please complete the Basic Information step first.');
      router.push('/companies/jobs/create/basicinformation');
    }
  }, [jobId, router]);

  const handleSubmit = async (data) => {
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Description saved successfully!');
      router.push(`/companies/jobs/create/skills?jobId=${jobId}`);
      return result;
    } catch (error) {
      toast.error('Failed to save description');
      return { error: error.message };
    }
  };

  const handleGenerateDescription = async (skills) => {
    try {
      await generateTailoredDescription(skills);
    } catch (error) {
      console.error('Error generating tailored description:', error.message);
      throw error;
    }
  };

  if (!jobId) {
    return (
      <div className="text-center p-6">
        <p>Redirecting to Basic Information...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <div className="relative">
     
<motion.div
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5, ease: 'easeOut' }}
  className="absolute top-6 right-6 md:top-12 md:right-100 transform translate-x-1/2 translate-y-1/2 z-10"
>
  <Button
    variant="outline"
    size="lg"
    className="flex items-center gap-2 bg-[#1e90ff]/10 hover:bg-[#1e90ff]/20 border border-[#1e90ff]/50 hover:border-[#1e90ff] rounded-full px-4 py-3 shadow-md hover:shadow-lg transition-all"
    onClick={() => setIsModalOpen(true)}
    disabled={isGeneratingDescription}
  >
    <span className="text-2xl text-[#1e90ff]">⚡️</span>
    <span className="text-sm font-medium text-[#1e90ff]">AI Generate Description</span>
  </Button>
</motion.div>
        <FormContainer
          step={step}
          form={form}
          nextStep={() => form.handleSubmit(handleSubmit)()}
          prevStep={prevStep}
          onSubmit={handleSubmit}
          stepIsValid={stepIsValid}
          jobOptions={jobOptions}
          extractedSkills={extractedSkills}
          isLoadingSkills={isLoadingSkills}
          isLoadingOptions={isLoadingOptions}
        />
      </div>
      <TailoredDescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={jobId}
        onSubmitSkills={handleGenerateDescription}
        isLoading={isGeneratingDescription}
      />
    </>
  );
}

export default function Description() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <DescriptionInner />
    </Suspense>
  );
}