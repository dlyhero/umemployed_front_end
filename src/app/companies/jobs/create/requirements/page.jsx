'use client';
import { Form } from '@/components/ui/form';
import { ProgressStepper } from '../../components/ProgressStepper';
import { FormNavigation } from '../../components/FormNavigation';
import { useJobForm } from '../../../../../hooks/useJobForm';
import { Step2Requirements } from '../../components';

export default function Requirements() {
  const currentStep = 'requirements';
  const { form, onSubmit, stepIsValid, prevStep, jobId, sessionStatus, getStepNumber } = useJobForm(currentStep);

  const handleSubmit = async (data) => {
    const response = await onSubmit(data);
    if (response.error) form.setError('root', { message: response.error });
  };

  if (!jobId) return <div className="text-center p-6">Please complete the previous step first.</div>;

  return (
    <main className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl mt-5">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Post a New Job</h2>
        <p className="text-gray-600 mt-1">Fill in the details to create a job posting.</p>
        <p className="text-gray-600 mt-1">Step: {getStepNumber()} | Job ID: {jobId}</p>
      </div>
      <ProgressStepper step={getStepNumber()} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          <Step2Requirements form={form} />
          <FormNavigation step={getStepNumber()} prevStep={prevStep} isSubmitting={form.formState.isSubmitting} isValid={stepIsValid()} />
          {form.formState.errors.root && <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>}
        </form>
      </Form>
    </main>
  );
}