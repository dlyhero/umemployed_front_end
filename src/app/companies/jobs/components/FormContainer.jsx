// src/app/companies/jobs/components/FormContainer.jsx
'use client';
import { useEffect, useState } from 'react';
import { Form } from '@/components/ui/form';
import { ProgressStepper } from './ProgressStepper';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Requirements } from './Step2Requirements';
import { Step3Description } from './Step3Description';
import { Step4Skills } from './Step4Skills';
import { FormNavigation } from './FormNavigation';
import { useJobStore } from '../../../../store/jobStore';

export const FormContainer = ({ 
  step, 
  form, 
  nextStep, 
  prevStep, 
  onSubmit, 
  stepIsValid, 
  jobOptions, 
  extracted_skills = [], 
  isLoadingSkills = false, 
  isLoadingOptions = false,
}) => {
  const { getExtractedSkills } = useJobStore();
  const [currentSkills, setCurrentSkills] = useState(extracted_skills);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const skills = getExtractedSkills();
    console.log('FormContainer - Updated extracted_skills from store:', skills);
    setCurrentSkills(skills);
  }, [getExtractedSkills]);

  const isStepValid = typeof stepIsValid === 'function' ? stepIsValid() : false;

  console.log('FormContainer - step:', step, 'extracted_skills:', currentSkills, 'isLoadingSkills:', isLoadingSkills, 'isLoadingOptions:', isLoadingOptions);

  const handleSubmit = async (data) => {
    console.log('FormContainer handleSubmit called with data:', data);
    setIsTransitioning(true);
    try {
      const result = await onSubmit(data);
      if (!result?.error) {
        await nextStep(result?.id); // Pass jobId if available
      }
    } finally {
      setIsTransitioning(false);
    }
  };

  return (
    <main className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl mt-5">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Post a New Job</h2>
        <p className="text-gray-600 mt-1">Fill in the details to create a job posting.</p>
        <p className="text-gray-600 mt-1">Step {step} of 4</p>
      </div>
      <ProgressStepper step={step} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {step === 1 && <Step1BasicInfo form={form} jobOptions={jobOptions} isLoadingOptions={isLoadingOptions} />}
          {step === 2 && <Step2Requirements form={form} jobOptions={jobOptions} />}
          {step === 3 && <Step3Description form={form} />}
          {step === 4 && (
            <div className="relative">
              {isLoadingSkills && (
                <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-75">
                  <div className="spinner"></div>
                </div>
              )}
              <Step4Skills 
                form={form} 
                extracted_skills={currentSkills}
                isLoadingSkills={isLoadingSkills}
              />
            </div>
          )}
          <FormNavigation
            step={step}
            nextStep={() => form.handleSubmit(handleSubmit)()}
            prevStep={prevStep}
            isSubmitting={form.formState.isSubmitting}
            isValid={isStepValid}
            isLoading={isTransitioning || isLoadingSkills}
          />
          {form.formState.errors.root && (
            <p className="text-red-500 text-sm">{form.formState.errors.root.message}</p>
          )}
        </form>
      </Form>
    </main>
  );
};