// src/app/companies/jobs/create/requirements/page.jsx
'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

function RequirementsInner() {
  const currentStep = 'requirements';
  const router = useRouter();
  const searchParams = useSearchParams();
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions, extractedSkills, isLoadingOptions, isLoadingSkills, jobId } = useJobForm(currentStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!jobId) {
      console.warn('No jobId for requirements step, redirecting to basicinformation');
      toast.error('Please complete the Basic Information step first.');
      router.push('/companies/jobs/create/basicinformation');
    }
  }, [jobId, router]);

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Requirements saved successfully!');
      // Delay to show spinner before navigation
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/companies/jobs/create/description?jobId=${jobId}`);
      return result;
    } catch (error) {
      toast.error('Failed to save requirements');
      return { error: error.message };
    } finally {
      setIsSubmitting(false);
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
    </>
  );
}

export default function Requirements() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <RequirementsInner />
    </Suspense>
  );
}