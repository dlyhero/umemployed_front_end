'use client';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';

export default function BasicInformation() {
  const currentStep = 'basicinformation';
  const { form, onSubmit, stepIsValid, prevStep, jobId, getStepNumber } = useJobForm(currentStep);

  const handleSubmit = async (data) => {
    console.log('BasicInformation handleSubmit called with data:', data);
    const response = await onSubmit(data);
    if (response.error) {
      console.error('Submission error:', response.error);
      form.setError('root', { message: response.error });
    } else {
      console.log('Submission successful:', response);
    }
  };

  return (
    <FormContainer
      step={getStepNumber()}
      form={form}
      nextStep={() => form.handleSubmit(handleSubmit)()}
      prevStep={prevStep}
      onSubmit={handleSubmit}
      stepIsValid={stepIsValid}
    />
  );
}