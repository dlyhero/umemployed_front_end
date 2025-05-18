'use client';
import { useState, useEffect, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '../app/companies/jobs/schemas/jobSchema';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export const useJobForm = (currentStep) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [jobId, setJobId] = useState(null);
  const [extracted_skills, setExtractedSkills] = useState([]);
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
      job_type: '',
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
        const response = await fetch('https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/job/job-options/', {
          headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) throw new Error('Failed to fetch job options');
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
        console.error('Error fetching job options:', error);
        form.setError('root', { message: 'Failed to load job options.' });
      }
    };
    fetchJobOptions();
  }, [form]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedData = localStorage.getItem('jobFormData');
      const savedJobId = localStorage.getItem('jobId');
      const savedSkills = localStorage.getItem('extracted_skills');
      console.log('Loading from localStorage - jobId:', savedJobId, 'savedSkills:', savedSkills);

      if (savedData) form.reset(JSON.parse(savedData));
      if (savedJobId) setJobId(savedJobId);

      let parsedSkills = [];
      if (savedSkills) {
        const skills = JSON.parse(savedSkills);
        parsedSkills = Array.isArray(skills) ? skills : [];
        setExtractedSkills(parsedSkills);
        console.log('Loaded extracted_skills from localStorage:', parsedSkills);
      }

      if (currentStep === 'skills' && savedJobId && parsedSkills.length === 0) {
        const loadSkills = async () => {
          setIsLoadingSkills(true);
          const skills = await fetchExtractedSkills(savedJobId);
          setExtractedSkills(skills);
          localStorage.setItem('extracted_skills', JSON.stringify(skills));
          setIsLoadingSkills(false);
          console.log('Fetched extracted_skills on Step 4 load:', skills);
          if (skills.length === 0) {
            form.setError('root', { message: 'No skills extracted. Please go back and update the description.' });
          }
        };
        loadSkills();
      }
    }
  }, [form, currentStep, fetchExtractedSkills]);

  const saveFormData = (data) => {
    localStorage.setItem('jobFormData', JSON.stringify(data));
  };


  const fetchExtractedSkills = useCallback(
    async (jobId) => {
      console.log('fetchExtractedSkills called with jobId:', jobId, 'token:', session?.accessToken || session?.token);
      try {
        const response = await fetch(`https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api/job/jobs/${jobId}/extracted-skills/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken || session?.token}`,
          },
        });
  
        console.log('fetchExtractedSkills response status:', response.status);
  
        if (!response.ok) {
          const errorData = await response.json();
          console.error('fetchExtractedSkills error:', errorData);
          throw new Error(errorData.message || 'Failed to fetch extracted skills');
        }
  
        const data = await response.json();
        const skills = Array.isArray(data.extracted_skills) ? data.extracted_skills : [];
        console.log('fetchExtractedSkills successful, skills:', skills);
        return skills;
      } catch (error) {
        console.error('Error fetching extracted skills:', error.message);
        return [];
      }
    },
    [session?.accessToken, session?.token] // dependencies
  );
  

  const onSubmit = async (data) => {
    const baseUrl = 'https://umemployed-f6fdddfffmhjhjcj.canadacentral-01.azurewebsites.net/api'; // Use the real backend URL
    console.log('onSubmit called with data:', data);

    if (status === 'loading') return { error: 'Session is still loading' };
    if (status === 'unauthenticated') return { error: 'Please log in to create a job.' };

    const token = session?.accessToken || session?.token;
    if (!token) return { error: 'No authentication token found' };

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
          const errorData = await response.json();
          console.error('Step 1 error response:', errorData);
          throw new Error(errorData.message || 'Failed to create job');
        }

        const result = await response.json();
        setJobId(result.id);
        localStorage.setItem('jobId', result.id);
        saveFormData({ ...form.getValues(), ...step1Data });
        form.reset({ ...form.getValues(), ...step1Data });
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
          const errorData = await response.json();
          console.error('Step 2 error response:', errorData);
          throw new Error(errorData.message || 'Failed to update step 2');
        }
        const result = await response.json();
        saveFormData({ ...form.getValues(), ...step2Data });
        return result;
      } else if (currentStep === 'description' && jobId) {
        const step3Data = step3Schema.parse(data);
        const response = await fetch(`${baseUrl}/job/${jobId}/create-step3/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step3Data),
        });
        if (!response.ok) {
          const errorData = await response.json();
          console.error('Step 3 error response:', errorData);
          throw new Error(errorData.message || 'Failed to update step 3');
        }
        const result = await response.json();
        setIsLoadingSkills(true);
        const skills = await fetchExtractedSkills(jobId);
        setExtractedSkills(skills);
        localStorage.setItem('extracted_skills', JSON.stringify(skills));
        setIsLoadingSkills(false);
        if (skills.length === 0) {
          form.setError('root', { message: 'No skills extracted. Please go back and update the description.' });
        }
        saveFormData({ ...form.getValues(), ...step3Data });
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
          const errorData = await response.json();
          console.error('Step 4 submission failed:', errorData);
          throw new Error(errorData.message || 'Failed to save job');
        }

        localStorage.clear();
        return { success: true };
      }
      throw new Error('Invalid step or missing job ID');
    } catch (error) {
      console.error('API error:', error.message);
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
    extracted_skills, 
    jobOptions, 
    isLoadingSkills 
  };
};