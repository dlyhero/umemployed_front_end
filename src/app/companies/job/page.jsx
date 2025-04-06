// /job/page.jsx
'use client';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useJobForm } from '@/src/hooks/useJobForm';
import { FormContainer } from './components';
import Loader from '@/src/components/common/Loader/Loader';
import axios from 'axios';

export default function JobPostingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { step, form, nextStep, prevStep, stepIsValid } = useJobForm(); // Ensure stepIsValid is destructured

  if (status === 'loading') {
    return <Loader />;
  }
  if (status === 'unauthenticated') {
    router.push('/api/auth/signin');
    return null;
  }

  const onSubmit = async (data) => {
    const token = session?.user?.accessToken || session?.accessToken;
    if (!token) {
      alert('No authentication token found. Please sign in again.');
      return;
    }

    try {
      await axios.post(
        'https://umemployed-app-afec951f7ec7.herokuapp.com/api/job/create-job/',
        data,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      alert('Job posted successfully!');
      router.push('/recruiter/dashboard');
    } catch (error) {
      console.error('Error posting job:', error);
      alert('Failed to post job. Please try again.');
    }
  };

  return (
    <FormContainer
      step={step}
      form={form}
      nextStep={nextStep}
      prevStep={prevStep}
      onSubmit={onSubmit}
      stepIsValid={stepIsValid} // Pass stepIsValid as a prop
    />
  );
}