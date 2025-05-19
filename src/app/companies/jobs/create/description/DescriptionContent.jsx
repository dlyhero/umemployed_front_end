'use client';
import { Suspense, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

function DescriptionContent() {
  const currentStep = 'description';
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions, extractedSkills, isLoadingOptions, isLoadingSkills } = useJobForm(currentStep);

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

export default function Description() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <DescriptionContent />
    </Suspense>
  );
}