'use client';
import { useRouter, useParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';
import { Suspense } from 'react';

function JobPostingContent() {
  const router = useRouter();
  const { companyId } = useParams();
  const { step, form, onSubmit: handleSubmit, stepIsValid, nextStep, prevStep, jobOptions, extractedSkills } = useJobForm('basicinformation');

  const onSubmit = async (data) => {
    try {
      const result = await handleSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return { error: result.error };
      }
      if (step === 4) {
        toast.success('Job created successfully!');
        router.push(`/companies/${companyId}/dashboard`);
      } else {
        toast.success(`Step ${step} saved successfully!`);
        nextStep();
      }
      return { success: true };
    } catch (error) {
      toast.error('Failed to submit step');
      return { error: error.message };
    }
  };

  return (
    <>
      <Toaster position="top-right" />
      <FormContainer
        step={step}
        form={form}
        nextStep={nextStep}
        prevStep={prevStep}
        onSubmit={onSubmit}
        stepIsValid={stepIsValid}
        jobOptions={jobOptions}
        extractedSkills={extractedSkills}
      />
    </>
  );
}

export default function JobPostingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e90ff]"></div>
        </div>
      }
    >
      <JobPostingContent />
    </Suspense>
  );
}