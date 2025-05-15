'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '../app/companies/jobs/schemas/jobSchema';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession, signIn } from 'next-auth/react';

export const useJobForm = (currentStep) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const jobIdFromParams = searchParams.get('jobId');
  const { data: session, status } = useSession();
  const [jobId, setJobId] = useState(jobIdFromParams);
  const [extractedSkills, setExtractedSkills] = useState([]);
  const [jobOptions, setJobOptions] = useState({
    categories: [],
    salary_ranges: {},
    job_location_types: {},
    job_types: {},
    experience_levels: {},
    weekly_ranges: {},
    shifts: {},
    locations: [],
  });
  const [isLoadingSkills, setIsLoadingSkills] = useState(false);

  const stepSchemas = {
    basicinformation: step1Schema,
    requirements: step2Schema,
    description: step3Schema,
    skills: step4Schema,
  };

  const stepNumbers = {
    basicinformation: 1,
    requirements: 2,
    description: 3,
    skills: 4,
  };

  const form = useForm({
    resolver: zodResolver(stepSchemas[currentStep]),
    defaultValues: {
      title: '',
      hire_number: 1,
      job_type: '',
      job_location_type: '',
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
      isSubmitting: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchJobOptions = async () => {
      try {
        const token = session?.accessToken || session?.token;
        const headers = {
          'Content-Type': 'application/json',
        };
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        } else {
          console.warn('No token available for fetchJobOptions');
        }

        const response = await fetch('https://umemployed-app-afec951f7ec7.herokuapp.com/api/job/job-options/', {
          headers,
        });
        if (!response.ok) {
          const text = await response.text();
          console.error('fetchJobOptions response:', text);
          throw new Error(`Failed to fetch job options: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setJobOptions({
          categories: data.categories || [],
          salary_ranges: data.salary_ranges || {},
          job_location_types: data.job_location_types || {},
          job_types: data.job_types || {},
          experience_levels: data.experience_levels || {},
          weekly_ranges: data.weekly_ranges || {},
          shifts: data.shifts || {},
          locations: data.locations || [],
        });
      } catch (error) {
        console.error('Error fetching job options:', error.message);
        form.setError('root', { message: 'Failed to load job options.' });
      }
    };
    if (status === 'authenticated') {
      fetchJobOptions();
    }
  }, [form, session, status]);

  useEffect(() => {
    if (currentStep === 'skills' && jobId && status === 'authenticated') {
      const loadSkills = async () => {
        setIsLoadingSkills(true);
        const skills = await fetchExtractedSkills(jobId);
        setExtractedSkills(skills);
        setIsLoadingSkills(false);
        if (skills.length === 0) {
          form.setError('root', { message: 'No skills extracted. Please go back and update the description.' });
        }
      };
      loadSkills();
    }
  }, [currentStep, jobId, status]);

  const fetchExtractedSkills = async (jobId) => {
    console.log('fetchExtractedSkills called with jobId:', jobId, 'token:', session?.accessToken || session?.token);
    try {
      const token = session?.accessToken || session?.token;
      if (!token) {
        throw new Error('No authentication token available');
      }
      const response = await fetch(`https://umemployed-app-afec951f7ec7.herokuapp.com/api/job/jobs/${jobId}/extracted-skills/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      console.log('fetchExtractedSkills response status:', response.status);
      if (!response.ok) {
        const text = await response.text();
        console.error('fetchExtractedSkills response:', text);
        throw new Error(`Failed to fetch extracted skills: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      const skills = Array.isArray(data.extracted_skills) ? data.extracted_skills : [];
      console.log('fetchExtractedSkills successful, skills:', skills);
      return skills;
    } catch (error) {
      console.error('Error fetching extracted skills:', error.message);
      form.setError('root', { message: error.message });
      return [];
    }
  };

  const onSubmit = async (data) => {
    const baseUrl = 'https://umemployed-app-afec951f7ec7.herokuapp.com/api';
    console.log('onSubmit called with data:', data, 'session status:', status, 'token:', session?.accessToken || session?.token);

    if (status === 'loading') {
      form.setError('root', { message: 'Session is still loading. Please wait.' });
      return { error: 'Session is still loading. Please wait.' };
    }
    if (status === 'unauthenticated') {
      console.warn('User is unauthenticated, redirecting to login');
      signIn(null, { callbackUrl: `/companies/jobs/create/${currentStep}${jobId ? `?jobId=${jobId}` : ''}` });
      form.setError('root', { message: 'Please log in to create a job.' });
      return { error: 'Please log in to create a job.' };
    }

    const token = session?.accessToken || session?.token;
    if (!token) {
      console.warn('No token found, redirecting to login');
      signIn(null, { callbackUrl: `/companies/jobs/create/${currentStep}${jobId ? `?jobId=${jobId}` : ''}` });
      form.setError('root', { message: 'No authentication token found. Please log in.' });
      return { error: 'No authentication token found. Please log in.' };
    }

    try {
      await form.setValue('isSubmitting', true, { shouldValidate: false });

      if (currentStep === 'basicinformation') {
        const step1Data = {
          ...step1Schema.parse(data),
          category: parseInt(data.category, 10),
          location: data.location,
        };
        console.log('Submitting Step 1 data:', step1Data);
        const response = await fetch(`${baseUrl}/job/create-step1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step1Data),
        });

        if (!response.ok) {
          const text = await response.text();
          console.error('Step 1 response:', text);
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || `Failed to create job: ${response.status} ${response.statusText}`);
          } catch (jsonError) {
            throw new Error(`Failed to create job: ${response.status} ${response.statusText} - Response: ${text.substring(0, 100)}`);
          }
        }

        const result = await response.json();
        setJobId(result.id);
        return result;
      } else if (currentStep === 'requirements' && jobId) {
        const step2Data = step2Schema.parse(data);
        console.log('Submitting Step 2 data:', step2Data);
        const response = await fetch(`${baseUrl}/job/${jobId}/create-step2/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step2Data),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error('Step 2 response:', text);
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || `Failed to update step 2: ${response.status} ${response.statusText}`);
          } catch (jsonError) {
            throw new Error(`Failed to update step 2: ${response.status} ${response.statusText} - Response: ${text.substring(0, 100)}`);
          }
        }
        const result = await response.json();
        return result;
      } else if (currentStep === 'description' && jobId) {
        const step3Data = step3Schema.parse(data);
        console.log('Submitting Step 3 data:', step3Data);
        const response = await fetch(`${baseUrl}/job/${jobId}/create-step3/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step3Data),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error('Step 3 response:', text);
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || `Failed to update step 3: ${response.status} ${response.statusText}`);
          } catch (jsonError) {
            throw new Error(`Failed to update step 3: ${response.status} ${response.statusText} - Response: ${text.substring(0, 100)}`);
          }
        }
        const result = await response.json();
        setIsLoadingSkills(true);
        const skills = await fetchExtractedSkills(jobId);
        setExtractedSkills(skills);
        setIsLoadingSkills(false);
        if (skills.length === 0) {
          form.setError('root', { message: 'No skills extracted. Please go back and update the description.' });
        }
        return result;
      } else if (currentStep === 'skills' && jobId) {
        const step4Data = {
          requirements: Array.isArray(data.requirements) ? data.requirements : [],
          level: data.level || 'Beginner',
        };
        console.log('Submitting Step 4 data:', step4Data);
        const response = await fetch(`${baseUrl}/job/${jobId}/create-step4/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step4Data),
        });
        if (!response.ok) {
          const text = await response.text();
          console.error('Step 4 response:', text);
          try {
            const errorData = JSON.parse(text);
            throw new Error(errorData.message || `Failed to save job: ${response.status} ${response.statusText}`);
          } catch (jsonError) {
            throw new Error(`Failed to save job: ${response.status} ${response.statusText} - Response: ${text.substring(0, 100)}`);
          }
        }
        return { success: true };
      }
      throw new Error('Invalid step or missing job ID');
    } catch (error) {
      console.error('API error:', error.message);
      form.setError('root', { message: error.message });
      return { error: error.message };
    } finally {
      await form.setValue('isSubmitting', false, { shouldValidate: false });
    }
  };

  const stepIsValid = () => {
    const errors = form.formState.errors;
    if (currentStep === 'basicinformation') {
      return (
        !errors.title &&
        !errors.hire_number &&
        !errors.job_type &&
        !errors.job_location_type &&
        !errors.location &&
        !errors.salary_range &&
        !errors.category
      );
    }
    if (currentStep === 'requirements') {
      return !errors.job_type && !errors.experience_levels && !errors.weekly_ranges && !errors.shifts;
    }
    if (currentStep === 'description') {
      return !errors.description && !errors.responsibilities && !errors.benefits;
    }
    if (currentStep === 'skills') {
      return !errors.requirements && !errors.level;
    }
    return false;
  };

  const nextStep = () => {
    const steps = ['basicinformation', 'requirements', 'description', 'skills'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      if (currentStep === 'description' && isLoadingSkills) {
        console.log('Waiting for skills to load before navigating to Step 4...');
        return;
      }
      router.push(`/companies/jobs/create/${steps[currentIndex + 1]}${jobId ? `?jobId=${jobId}` : ''}`);
    }
  };

  const prevStep = () => {
    const steps = ['basicinformation', 'requirements', 'description', 'skills'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      router.push(`/companies/jobs/create/${steps[currentIndex - 1]}${jobId ? `?jobId=${jobId}` : ''}`);
    }
  };

  const getStepNumber = () => stepNumbers[currentStep] || 1;

  return {
    step: getStepNumber(),
    form,
    onSubmit,
    stepIsValid,
    nextStep,
    prevStep,
    jobId,
    extracted_skills: extractedSkills,
    jobOptions,
    isLoadingSkills,
  };
};