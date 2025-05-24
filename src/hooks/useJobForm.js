// src/hooks/useJobForm.js
'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '../app/companies/jobs/schemas/jobSchema';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useJobStore } from '../store/jobStore';
import { toast } from 'react-hot-toast';

export const useJobForm = (currentStep) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const {
    formData,
    setFormData,
    jobId: storedJobId,
    setJobId,
    extractedSkills,
    setExtractedSkills,
    getExtractedSkills,
    isSubmittingStep1,
    setIsSubmittingStep1,
    clearStore,
  } = useJobStore();
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
  const [isLoadingOptions, setIsLoadingOptions] = useState(true);

  const jobId = searchParams.get('jobId') || storedJobId;

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
      title: formData.title || '',
      hire_number: formData.hire_number || 1,
      job_type: formData.job_type || '',
      job_location_type: formData.job_location_type || '',
      location: formData.location || '',
      salary_range: formData.salary_range || 'Not specified',
      category: formData.category || null,
      experience_levels: formData.experience_levels || '',
      weekly_ranges: formData.weekly_ranges || '',
      shifts: formData.shifts || '',
      description: formData.description || '',
      responsibilities: formData.responsibilities || '',
      benefits: formData.benefits || '',
      requirements: formData.requirements || [],
      level: formData.level || 'Beginner',
      isSubmitting: false,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    const fetchJobOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (session?.accessToken || session?.token) {
          headers['Authorization'] = `Bearer ${session.accessToken || session.token}`;
        }
        const response = await fetch('https://server.umemployed.com/api/job/job-options/', {
          method: 'GET',
          headers,
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to fetch job options: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        setJobOptions({
          categories: Array.isArray(data.categories) ? data.categories : [],
          salary_ranges: data.salary_ranges && typeof data.salary_ranges === 'object' ? data.salary_ranges : {},
          job_location_types: data.job_location_types && typeof data.job_location_types === 'object' ? data.job_location_types : {},
          job_types: data.job_types && typeof data.job_types === 'object' ? data.job_types : {},
          experience_levels: data.experience_levels && typeof data.experience_levels === 'object' ? data.experience_levels : {},
          weekly_ranges: data.weekly_ranges && typeof data.weekly_ranges === 'object' ? data.weekly_ranges : {},
          shifts: data.shifts && typeof data.shifts === 'object' ? data.shifts : {},
          locations: Array.isArray(data.locations) ? data.locations : [],
        });
      } catch (error) {
        console.error('Error fetching job options:', error.message);
        form.setError('root', { message: 'Failed to load job options. Please try again.' });
      } finally {
        setIsLoadingOptions(false);
      }
    };
    if (status === 'unauthenticated') {
      router.push('/login');
      return;
    }
    fetchJobOptions();
  }, [form, session, status, router]);

  useEffect(() => {
    if (currentStep === 'basicinformation') {
      clearStore();
      form.reset();
    } else if (currentStep === 'skills' && jobId) {
      const loadSkills = async () => {
        setIsLoadingSkills(true);
        try {
          const skills = await fetchExtractedSkills(jobId);
          setExtractedSkills(skills);
          if (skills.length === 0) {
            form.setError('root', { message: 'No skills extracted. Please go back and update the description.' });
          } else {
            form.clearErrors('root');
          }
        } catch (error) {
          console.error('Error loading skills:', error.message);
          form.setError('root', { message: 'Failed to load skills. Please try again.' });
        } finally {
          setIsLoadingSkills(false);
        }
      };
      loadSkills();
    } else if (!jobId && currentStep !== 'basicinformation') {
      toast.error('No job ID found. Please complete the Basic Information step first.');
      router.push('/companies/jobs/create/basicinformation');
    }
  }, [currentStep, jobId, form, setExtractedSkills, clearStore, router]);

  const fetchExtractedSkills = async (jobId) => {
    console.log('fetchExtractedSkills called with jobId:', jobId);
    try {
      const response = await fetch(`https://server.umemployed.com/api/job/jobs/${jobId}/extracted-skills/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken || session?.token}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch extracted skills: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      const skills = Array.isArray(data.extracted_skills) ? data.extracted_skills : [];
      console.log('fetchExtractedSkills successful, skills:', skills);
      return skills;
    } catch (error) {
      console.error('Error fetching extracted skills:', error.message);
      return [];
    }
  };

  const verifyJob = async (jobId, retries = 3, delay = 1000) => {
    console.log('Verifying job with jobId:', jobId);
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`https://server.umemployed.com/api/job/jobs/${jobId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken || session?.token}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to verify job: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        console.log('Job verification response:', data);
        const verifiedJobId = data.id || data.job_id || null;
        if (!verifiedJobId) {
          throw new Error('No job ID found in verification response');
        }
        return verifiedJobId;
      } catch (error) {
        console.error('Error verifying job:', error.message);
        if (i < retries - 1) {
          console.warn(`Retrying job verification (${i + 1}/${retries})...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        return null;
      }
    }
    return null;
  };

  const onSubmit = async (data) => {
    const baseUrl = 'https://server.umemployed.com/api';
    console.log('onSubmit called with data:', data);

    if (status === 'loading') return { error: 'Session is still loading' };
    if (status === 'unauthenticated') return { error: 'Please log in to create a job.' };

    const token = session?.accessToken || session?.token;
    if (!token) return { error: 'No authentication token found' };

    if (!jobId && currentStep !== 'basicinformation') {
      return { error: 'No job ID found. Please complete previous steps.' };
    }

    try {
      await form.setValue('isSubmitting', true, { shouldValidate: false });

      if (currentStep === 'basicinformation') {
        setIsSubmittingStep1(true);
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
          const errorText = await response.text();
          throw new Error(`Failed to create job: ${response.status} ${errorText}`);
        }

        const result = await response.json();
        console.log('Step 1 response:', JSON.stringify(result, null, 2));
        const newJobId = result.id || result.job_id || null;
        if (!newJobId) {
          throw new Error('No job ID returned in Step 1 response');
        }

        const verifiedJobId = await verifyJob(newJobId);
        if (!verifiedJobId) {
          throw new Error('Job verification failed. Please try again.');
        }

        setFormData(step1Data);
        setJobId(verifiedJobId);
        form.reset({ ...form.getValues(), ...step1Data });
        return { ...result, id: verifiedJobId }; // Return the verified jobId
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
          const errorText = await response.text();
          throw new Error(`Failed to update step 2: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        setFormData(step2Data);
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
          const errorText = await response.text();
          throw new Error(`Failed to update step 3: ${response.status} ${errorText}`);
        }
        const result = await response.json();
        setIsLoadingSkills(true);
        const skills = await fetchExtractedSkills(jobId);
        setExtractedSkills(skills);
        setIsLoadingSkills(false);
        if (skills.length === 0) {
          form.setError('root', { message: 'No skills extracted. Please go back and update the description.' });
        }
        setFormData(step3Data);
        return result;
      } else if (currentStep === 'skills' && jobId) {
        const step4Data = {
          requirements: Array.isArray(data.requirements) ? data.requirements : [],
          level: data.level || 'Mid',
        };
        console.log('Submitting Step 4 data:', step4Data);

        toast.success('Good! Your job will be posted in 03 minutes');
        const companyId = session?.user?.company_id || session?.companyid;
        if (companyId) {
          router.push(`/companies/${companyId}/dashboard`);
        } else {
          console.error('No companyId found in session');
          form.setError('root', { message: 'Failed to redirect: Company ID not found.' });
        }

        fetch(`${baseUrl}/job/${jobId}/create-step4/`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step4Data),
        })
          .then(async (response) => {
            if (!response.ok) {
              const errorText = await response.text();
              throw new Error(`Failed to save step 4: ${response.status} ${errorText}`);
            }
            const result = await response.json();
            console.log('Step 4 response:', result);
            clearStore();
            return { success: true, data: result };
          })
          .catch((error) => {
            console.error('Background API error:', error.message);
            toast.error('Failed to post job. Please try again later.');
          });

        return { success: true };
      }
      throw new Error('Invalid step or missing job ID');
    } catch (error) {
      console.error('API error:', error.message);
      return { error: error.message };
    } finally {
      await form.setValue('isSubmitting', false, { shouldValidate: false });
      if (currentStep === 'basicinformation') {
        setIsSubmittingStep1(false);
      }
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

  const nextStep = async (newJobId) => {
    const steps = ['basicinformation', 'requirements', 'description', 'skills'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      if (currentStep === 'description' && isLoadingSkills) {
        console.log('Waiting for skills to load before navigating to Step 4...');
        return;
      }
      // Use newJobId directly if provided, otherwise fallback to stored jobId
      const effectiveJobId = newJobId || storedJobId;
      if (!effectiveJobId) {
        console.error('Cannot navigate to next step: No jobId available');
        form.setError('root', { message: 'Failed to create job. Please try again.' });
        toast.error('Failed to create job. Please try again.');
        router.push('/companies/jobs/create/basicinformation');
        return;
      }
      // Verify jobId before navigating
      const verifiedJobId = await verifyJob(effectiveJobId);
      if (!verifiedJobId) {
        console.error('Job verification failed for jobId:', effectiveJobId);
        form.setError('root', { message: 'Failed to verify job. Please try again.' });
        toast.error('Failed to verify job. Please try again.');
        return;
      }
      setJobId(verifiedJobId); // Ensure jobId is stored
      const nextPath = `/companies/jobs/create/${steps[currentIndex + 1]}?jobId=${verifiedJobId}`;
      console.log('Navigating to next step:', steps[currentIndex + 1], 'with jobId:', verifiedJobId);
      router.push(nextPath);
    }
  };

  const prevStep = () => {
    const steps = ['basicinformation', 'requirements', 'description', 'skills'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevPath = `/companies/jobs/create/${steps[currentIndex - 1]}${jobId ? `?jobId=${jobId}` : ''}`;
      console.log('Navigating to previous step:', steps[currentIndex - 1], 'with jobId:', jobId);
      router.push(prevPath);
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
    extractedSkills: getExtractedSkills(),
    jobOptions,
    isLoadingSkills,
    isLoadingOptions,
    isSubmittingStep1,
  };
};