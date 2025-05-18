'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

export default function SkillsContent() {
  const currentStep = 'skills';
  const searchParams = useSearchParams();
  const { companyId } = useParams();
  const jobId = searchParams.get('jobId');
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions, extracted_skills, isLoadingSkills } = useJobForm(currentStep);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        setLoading(false);
        return;
      }
      // Show toast message indicating job will be posted in 3 minutes
      toast.success('Job submitted successfully! It will be posted in 3 minutes.', {
        duration: 3000,
      });
      // Immediately redirect to the company dashboard
      router.push(`/companies/${companyId}/dashboard`);
    } catch (error) {
      toast.error('Failed to create job');
      setLoading(false);
    }
  };

  if (!jobId) return <div className="text-center p-6">Please complete the previous step first.</div>;

  return (
    <>
      <Toaster position="top-right" />
      {loading || form.formState.isSubmitting ? (
        <div className="flex flex-col justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1e90ff]"></div>
          <p className="mt-4 text-gray-600">Submitting your job posting...</p>
        </div>
      ) : (
        <FormContainer
          step={step}
          form={form}
          nextStep={() => form.handleSubmit(handleSubmit)()}
          prevStep={prevStep}
          onSubmit={handleSubmit}
          stepIsValid={stepIsValid}
          jobOptions={jobOptions}
          extracted_skills={extracted_skills}
          isLoadingSkills={isLoadingSkills}
          currentStep={currentStep}
        />
      )}
    </>
  );
}