'use client';
import { useRouter, useParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';
import { Suspense } from 'react';

function JobPostingContent() {
  const router = useRouter();
  const { companyId } = useParams();
  const { step, form, onSubmit: handleSubmit, stepIsValid, nextStep, prevStep, jobOptions, extractedSkills, isLoadingOptions, isLoadingSkills, isSubmittingStep1 } = useJobForm('basicinformation');

  const onSubmit = async (data) => {
    console.log('FormContainer handleSubmit called with data:', data);
    try {
      const result = await handleSubmit(data);
      if (result?.error) {
        console.error('Step 1 submission error:', result.error);
        toast.error(result.error);
        return { error: result.error };
      }
      if (!result?.id) {
        console.error('No jobId in Step 1 response:', result);
        toast.error('Failed to create job: No job ID returned');
        return { error: 'No job ID returned' };
      }
      console.log('Step 1 submitted successfully with jobId:', result.id);
      toast.success(`Step ${step} saved successfully!`);
      await nextStep(result.id);
      return { success: true, jobId: result.id };
    } catch (error) {
      console.error('Step 1 submission failed:', error.message);
      toast.error('Failed to submit step');
      return { error: error.message };
    }
  };

  if (isSubmittingStep1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#1e90ff]"></div>
        <p className="ml-4 text-white text-lg">Creating job...</p>
      </div>
    );
  }

  return (
    <>
      <Toaster position="top-right" />
      <FormContainer
        step={step}
        form={form}
        nextStep={() => form.handleSubmit(onSubmit)()}
        prevStep={prevStep}
        onSubmit={onSubmit}
        stepIsValid={stepIsValid}
        jobOptions={jobOptions}
        extractedSkills={extractedSkills}
        isLoadingSkills={isLoadingSkills}
        isLoadingOptions={isLoadingOptions}
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