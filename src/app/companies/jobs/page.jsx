'use client';

import { useRouter } from 'next/navigation';
import { useJobForm } from '@/src/hooks/useJobForm';
import { FormContainer } from './components';
import axios from 'axios';

export default function JobPostingPage() {
  const router = useRouter();
  const { step, form, nextStep, prevStep, stepIsValid } = useJobForm();

  const onSubmit = async (data) => {
    try {
      // Post the form data
      await axios.post(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/job/create-job/',
        data
      );

      // If final step, show success and redirect
      if (step === 4) {
        alert('Job posted successfully!');
        router.push('/recruiter/dashboard');
      } else {
        // Go to next step
        nextStep();
      }

      return { success: true };
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
      return { error: 'Submission failed' };
    }
  };

  return (
    <FormContainer
      step={step}
      form={form}
      nextStep={nextStep}
      prevStep={prevStep}
      onSubmit={onSubmit}
      stepIsValid={stepIsValid}
    />
  );
}
