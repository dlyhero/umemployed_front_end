'use client';
import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

export default function Skills() {
  const currentStep = 'skills';
  const searchParams = useSearchParams();
  const { companyId } = useParams();
  const jobId = searchParams.get('jobId');
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions, extracted_skills } = useJobForm(currentStep);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Job created successfully!');
      setLoading(true);
      router.push(`/companies/${companyId}/dashboard`);
      return result;
    } catch (error) {
      toast.error('Failed to create job');
      return { error: error.message };
    }
  };

  if (!jobId) return <div className="text-center p-6">Please complete the previous step first.</div>;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e90ff]"></div>
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
        extracted_skills={extracted_skills} // Pass extracted_skills
      />
    </>
  );
}