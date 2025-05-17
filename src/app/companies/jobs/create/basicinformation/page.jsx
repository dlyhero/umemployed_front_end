'use client';
import { useRouter, useParams } from 'next/navigation';
import { useState } from 'react'; // Add useState
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

export default function BasicInformation() {
  const currentStep = 'basicinformation';
  const { companyId } = useParams();
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions } = useJobForm(currentStep);
  const [loading, setLoading] = useState(false); // Add loading state

  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Basic information saved successfully!');
      if (result.id) {
        setLoading(true); // Show loader during navigation
        router.push(`/companies/jobs/create/requirements?jobId=${result.id}`);
      }
      return result;
    } catch (error) {
      toast.error('Failed to save basic information');
      return { error: error.message };
    }
  };

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