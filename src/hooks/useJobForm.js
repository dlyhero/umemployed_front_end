'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { step1Schema, step2Schema, step3Schema, step4Schema } from '../app/companies/jobs/schemas/jobSchema';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useJobStore } from '../store/jobStore';
import { toast } from 'react-hot-toast';
import { checkSubscriptionStatus } from '../../lib/api/recruiter_subscribe';

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
  const [isGeneratingDescription, setIsGeneratingDescription] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');

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
    console.log('useJobForm Debug: Session', { status, userRole: session?.user?.role });

    const fetchJobOptions = async () => {
      setIsLoadingOptions(true);
      try {
        const headers = {
          'Content-Type': 'application/json',
        };
        if (session?.accessToken) {
          headers['Authorization'] = `Bearer ${session.accessToken}`;
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
        form.setError('root', { message: 'Failed to load job options. Please try again.' });
      } finally {
        setIsLoadingOptions(false);
      }
    };

    fetchJobOptions();
  }, [form, session, status, router]);

  useEffect(() => {
    if (currentStep === 'basicinformation') {
      clearStore();
      form.reset();
      console.log('useJobForm Debug: Form initialized for basicinformation');
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
    try {
      const response = await fetch(`https://server.umemployed.com/api/job/jobs/${jobId}/extracted-skills/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch extracted skills: ${response.status} ${errorText}`);
      }
      const data = await response.json();
      const skills = Array.isArray(data.extracted_skills) ? data.extracted_skills : [];
      return skills;
    } catch (error) {
      console.log('fetchExtractedSkills Debug: Error', { error: error.message });
      return [];
    }
  };

  const verifyJob = async (jobId, retries = 3, delay = 1000) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(`https://server.umemployed.com/api/job/jobs/${jobId}/`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.accessToken}`,
          },
        });
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Failed to verify job: ${response.status} ${errorText}`);
        }
        const data = await response.json();
        const verifiedJobId = data.id || data.job_id || null;
        if (!verifiedJobId) {
          throw new Error('No job ID found in verification response');
        }
        return verifiedJobId;
      } catch (error) {
        console.log('verifyJob Debug: Error', { error: error.message });
        if (i < retries - 1) {
          await new Promise((resolve) => setTimeout(resolve, delay));
          continue;
        }
        return null;
      }
    }
    return null;
  };

  const generateTailoredDescription = async (skills) => {
    if (!jobId) {
      throw new Error('No job ID available for generating tailored description.');
    }
    setIsGeneratingDescription(true);
    try {
      const response = await fetch(`https://server.umemployed.com/api/job/jobs/${jobId}/tailored-description/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ skills }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate tailored description: ${response.status} ${errorText}`);
      }

      const result = await response.json();
      form.setValue('description', result.description || '', { shouldValidate: true });
      form.setValue('responsibilities', result.responsibilities || '', { shouldValidate: true });
      form.setValue('benefits', result.benefits || '', { shouldValidate: true });

      setFormData({
        description: result.description,
        responsibilities: result.responsibilities,
        benefits: result.benefits,
      });

      return result;
    } catch (error) {
      console.log('generateTailoredDescription Debug: Error', { error: error.message });
      return { error: error.message };
    } finally {
      setIsGeneratingDescription(false);
    }
  };

  const checkSubscription = async () => {
    if (!session?.user?.user_id || !session?.accessToken) {
      return { has_active_subscription: false, error: 'No user ID or token found. Please log in.' };
    }
    try {
      const statusResponse = await checkSubscriptionStatus(
        session.user.user_id,
        'recruiter',
        session.accessToken
      );
      if (!statusResponse.has_active_subscription) {
        return { has_active_subscription: false, error: 'No active subscription found. Please subscribe to a plan.' };
      }
      return statusResponse;
    } catch (error) {
      console.log('checkSubscription Debug: Error', { error: error.message });
      return { has_active_subscription: false, error: 'Failed to check subscription status. Please try again.' };
    }
  };

  const onSubmit = async (data) => {
    const baseUrl = 'https://server.umemployed.com/api';

    console.log('onSubmit Debug: Starting submission', { currentStep, data, sessionStatus: status });

    if (status === 'loading') {
      console.log('onSubmit Debug: Session loading, exiting');
      return { error: 'Session is still loading' };
    }
    if (status === 'unauthenticated') {
      console.log('onSubmit Debug: Unauthenticated, exiting');
      return { error: 'Please log in to create a job.' };
    }

    const token = session?.accessToken;
    if (!token) {
      console.log('onSubmit Debug: No token, exiting');
      return { error: 'No authentication token found' };
    }

    if (!jobId && currentStep !== 'basicinformation') {
      console.log('onSubmit Debug: No jobId for non-basicinformation step', { currentStep });
      return { error: 'No job ID found. Please complete previous steps.' };
    }

    try {
      await form.setValue('isSubmitting', true, { shouldValidate: false });

      if (currentStep === 'basicinformation') {
        // Check subscription status before attempting to create job
        const subscriptionStatus = await checkSubscription();
        console.log('onSubmit Debug: Subscription Check', { subscriptionStatus });
        if (subscriptionStatus.error || !subscriptionStatus.has_active_subscription) {
          setSubscriptionError(subscriptionStatus.error || 'No active subscription found. Please subscribe to a plan.');
          setShowSubscriptionModal(true);
          console.log('onSubmit Debug: Subscription check failed, showing modal');
          return { error: subscriptionStatus.error || 'No active subscription' };
        }

        setIsSubmittingStep1(true);
        const step1Data = {
          ...step1Schema.parse(data),
          category: parseInt(data.category, 10),
          location: data.location,
        };
        console.log('onSubmit Debug: Sending POST to create-step1', { step1Data });
        const response = await fetch(`${baseUrl}/job/create-step1/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(step1Data),
        });

        if (!response.ok) {
          let errorMessage = `Failed to create job: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
          } catch (jsonError) {
            console.error('Non-JSON response:', {
              status: response.status,
              responseText: await response.text().slice(0, 200),
            });
          }
          console.log('onSubmit Debug: POST failed', { errorMessage, status: response.status });
          // If 403 error, show subscription modal
          if (response.status === 403) {
            setSubscriptionError(errorMessage.includes('No active subscription')
              ? 'No active subscription. Please subscribe to a plan.'
              : 'You do not have permission to create a job. Please check your subscription status.');
            setShowSubscriptionModal(true);
            console.log('onSubmit Debug: 403 error, showing subscription modal');
          }
          throw new Error(errorMessage);
        }

        const result = await response.json();
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
        console.log('onSubmit Debug: POST successful', { newJobId, verifiedJobId });
        return { ...result, id: verifiedJobId };
      } else if (currentStep === 'requirements' && jobId) {
        const step2Data = step2Schema.parse(data);
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
        console.log('onSubmit Debug: Step 2 PATCH successful', { result });
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
        console.log('onSubmit Debug: Step 3 PATCH successful', { result });
        return result;
      } else if (currentStep === 'skills' && jobId) {
        const step4Data = {
          requirements: Array.isArray(data.requirements) ? data.requirements : [],
          level: data.level || 'Mid',
        };

        toast.success('Good! Your job will be posted in 03 minutes');
        const companyId = session?.user?.company_id;
        if (companyId) {
          router.push(`/companies/${companyId}/dashboard`);
        } else {
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
            clearStore();
            console.log('onSubmit Debug: Step 4 PATCH successful', { result });
            return { success: true, data: result };
          })
          .catch((error) => {
            console.log('onSubmit Debug: Step 4 error', { error: error.message });
            toast.error('Failed to post job. Please try again later.');
          });

        return { success: true };
      }
      throw new Error('Invalid step or missing job ID');
    } catch (error) {
      console.log('onSubmit Debug: Error', { error: error.message });
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
    console.log('stepIsValid Debug:', { errors });
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
    console.log('nextStep Debug: Starting', { newJobId, storedJobId, currentStep });
    const steps = ['basicinformation', 'requirements', 'description', 'skills'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex < steps.length - 1) {
      if (currentStep === 'description' && isLoadingSkills) {
        console.log('nextStep Debug: Blocked by isLoadingSkills');
        return;
      }
      const effectiveJobId = newJobId || storedJobId;
      if (!effectiveJobId) {
        form.setError('root', { message: 'Failed to create job. Please try again.' });
        toast.error('Failed to create job. Please try again.');
        console.log('nextStep Debug: No effectiveJobId');
        router.push('/companies/jobs/create/basicinformation');
        return;
      }
      const verifiedJobId = await verifyJob(effectiveJobId);
      if (!verifiedJobId) {
        form.setError('root', { message: 'Failed to verify job. Please try again.' });
        toast.error('Failed to verify job. Please try again.');
        console.log('nextStep Debug: Job verification failed');
        return;
      }
      setJobId(verifiedJobId);
      const nextPath = `/companies/jobs/create/${steps[currentIndex + 1]}?jobId=${verifiedJobId}`;
      console.log('nextStep Debug: Navigating to', { nextPath });
      router.push(nextPath);
    }
  };

  const prevStep = () => {
    console.log('prevStep Debug: Starting', { currentStep, jobId });
    const steps = ['basicinformation', 'requirements', 'description', 'skills'];
    const currentIndex = steps.indexOf(currentStep);
    if (currentIndex > 0) {
      const prevPath = `/companies/jobs/create/${steps[currentIndex - 1]}${jobId ? `?jobId=${jobId}` : ''}`;
      console.log('prevStep Debug: Navigating to', { prevPath });
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
    generateTailoredDescription,
    isGeneratingDescription,
    showSubscriptionModal,
    setShowSubscriptionModal,
    subscriptionError,
  };
};
