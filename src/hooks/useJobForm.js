'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '../app/companies/jobs/schemas/jobSchema';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useJobForm = (currentStep) => {
  const router = useRouter();
  const { data: session, status } = useSession(); // Get session from NextAuth
  const [jobId, setJobId] = useState(null);
  const [extractedSkills, setExtractedSkills] = useState([]);

  const stepSchemas = {
    basicinformation: step1Schema,
    requirements: step2Schema,
    description: step3Schema,
    skills: step4Schema,
  };

  const form = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: {
      title: '',
      hire_number: 1,
      job_location_type: '',
      job_type: '',
      location: '',
      salary_range: 'Not specified',
      category: null,
      experience_levels: '',
      weekly_ranges: '',
      shifts: '',
      description: '',
      responsibilities: '',
      benefits: '',
      requirements: [],
      level: 'Beginner',
    },
    mode: 'onChange',
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('jobFormData');
      const savedJobId = localStorage.getItem('jobId');
      const savedSkills = localStorage.getItem('extractedSkills');
      if (savedData) form.reset(JSON.parse(savedData));
      if (savedJobId) setJobId(savedJobId);
      if (savedSkills) setExtractedSkills(JSON.parse(savedSkills));
    }
  }, [form]);

  const saveFormData = (data) => {
    localStorage.setItem('jobFormData', JSON.stringify(data));
  };

  const onSubmit = async (data) => {
    const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com';
    console.log('onSubmit called with data:', data);

    if (status === 'loading') {
      console.log('Session still loading...');
      return { error: 'Session is still loading' };
    }

    if (status === 'unauthenticated') {
      form.setError('root', { message: 'Please log in to create a job.' });
      return { error: 'Please log in to create a job.' };
    }

    const token = session?.accessToken || session?.token; // Adjust based on your NextAuth token key
    console.log('Session:', session);
    console.log('Token:', token);

    if (!token) {
      form.setError('root', { message: 'No authentication token found. Please log in again.' });
      return { error: 'No authentication token found' };
    }

    try {
      if (currentStep === 'basicinformation') {
        const step1Data = step1Schema.parse(data);
        console.log('Submitting Step 1 data:', step1Data);
        const response = await fetch(`${baseUrl}/api/job/create-step1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step1Data),
        });

        const responseText = await response.text();
        console.log('Raw response:', responseText);

        if (!response.ok) {
          let errorMessage = 'Failed to create job';
          try {
            const errorData = JSON.parse(responseText);
            errorMessage = errorData.message || errorData.detail || errorMessage;
          } catch (e) {
            errorMessage = `Server returned non-JSON response: ${responseText.slice(0, 100)}...`;
          }
          throw new Error(errorMessage);
        }

        const result = JSON.parse(responseText);
        console.log('Step 1 response:', result);
        setJobId(result.id);
        localStorage.setItem('jobId', result.id);
        const updatedData = {
          ...form.getValues(),
          ...step1Data,
          description: result.description || '',
          responsibilities: result.responsibilities || '',
          benefits: result.benefits || '',
          requirements: result.requirements || [],
          level: result.level || 'Beginner',
          experience_levels: result.experience_levels || '',
          weekly_ranges: result.weekly_ranges || '',
          shifts: result.shifts || '',
        };
        saveFormData(updatedData);
        form.reset(updatedData);
        router.push(`/jobs/create/requirements?jobId=${result.id}`);
        return result;
      } else if (currentStep === 'requirements' && jobId) {
        const step2Data = step2Schema.parse(data);
        const response = await fetch(`${baseUrl}/api/job/${jobId}/create-step2/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step2Data),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(JSON.parse(errorText).message || 'Failed to update step 2');
        }
        const result = await response.json();
        saveFormData({ ...form.getValues(), ...step2Data });
        router.push(`/jobs/create/description?jobId=${jobId}`);
        return result;
      } else if (currentStep === 'description' && jobId) {
        const step3Data = step3Schema.parse(data);
        const response = await fetch(`${baseUrl}/api/job/${jobId}/create-step3/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step3Data),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(JSON.parse(errorText).message || 'Failed to update step 3');
        }
        const result = await response.json();
        setExtractedSkills(result.extracted_skills || []);
        localStorage.setItem('extractedSkills', JSON.stringify(result.extracted_skills || []));
        saveFormData({ ...form.getValues(), ...step3Data });
        router.push(`/jobs/create/skills?jobId=${jobId}`);
        return result;
      } else if (currentStep === 'skills' && jobId) {
        const step4Data = step4Schema.parse(data);
        const response = await fetch(`${baseUrl}/api/job/${jobId}/create-step4/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step4Data),
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(JSON.parse(errorText).message || 'Failed to update step 4');
        }
        const result = await response.json();
        localStorage.clear();
        router.push('/jobs');
        return result;
      }
      throw new Error('Invalid step or missing job ID');
    } catch (error) {
      console.error('API error:', error);
      form.setError('root', { message: error.message || `Failed to submit Step ${currentStep}` });
      return { error: error.message };
    }
  };

  const stepIsValid = () => {
    const errors = form.formState.errors;
    console.log('Step validation errors:', errors);
    if (currentStep === 'basicinformation')
      return (
        !errors.title &&
        !errors.hire_number &&
        !errors.job_location_type &&
        !errors.job_type &&
        !errors.location &&
        !errors.salary_range &&
        !errors.category
      );
    if (currentStep === 'requirements')
      return !errors.job_type && !errors.experience_levels && !errors.weekly_ranges && !errors.shifts;
    if (currentStep === 'description') return !errors.description && !errors.responsibilities && !errors.benefits;
    if (currentStep === 'skills') return !errors.requirements && !errors.level;
    return false;
  };

  const prevStep = () => {
    if (currentStep === 'requirements') router.push('/jobs/create/basicinformation');
    else if (currentStep === 'description') router.push('/jobs/create/requirements');
    else if (currentStep === 'skills') router.push('/jobs/create/description');
  };

  const getStepNumber = () => {
    const steps = ['basicinformation', 'requirements', 'description', 'skills'];
    return steps.indexOf(currentStep) + 1;
  };

  return { form, onSubmit, stepIsValid, prevStep, jobId, extractedSkills, getStepNumber };
};