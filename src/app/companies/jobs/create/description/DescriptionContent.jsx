'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

export default function Description() {
  const currentStep = 'description';
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions } = useJobForm(currentStep);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Description saved successfully!');
      setLoading(true);
      router.push(`/companies/jobs/create/skills?jobId=${jobId}`);
      return result;
    } catch (error) {
      toast.error('Failed to save description');
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
      />
    </>
  );
}