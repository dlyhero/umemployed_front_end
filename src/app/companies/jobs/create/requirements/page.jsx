'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { Toaster, toast } from 'react-hot-toast';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

export default function Requirements() {
  const currentStep = 'requirements';
  const searchParams = useSearchParams();
  const jobId = searchParams.get('jobId');
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions, extractedSkills } = useJobForm(currentStep);

  const router = useRouter();

  const handleSubmit = async (data) => {
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Requirements saved successfully!');
      router.push(`/companies/jobs/create/description?jobId=${jobId}`);
      return result;
    } catch (error) {
      toast.error('Failed to save requirements');
      return { error: error.message };
    }
  };

  if (!jobId) return <div className="text-center p-6">Please complete the previous step first.</div>;

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
      />
    </>
  );
}