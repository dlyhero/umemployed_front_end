// /job/components/FormContainer.jsx
"use client";

import { useState } from "react";
import { ProgressStepper } from "./ProgressStepper";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2Requirements } from "./Step2Requirements";
import { Step3Description } from "./Step3Description";
import { Step4Skills } from "./Step4Skills";
import { FormNavigation } from "./FormNavigation";
import { useJobForm } from "../hooks/useJobForm";
import { Form } from "@/components/ui/form";

export const FormContainer = () => {
  const [step, setStep] = useState(0);
  const form = useJobForm();
  const totalSteps = 4;

  const handleNext = () => setStep((prev) => Math.min(prev + 1, totalSteps - 1));
  const handleBack = () => setStep((prev) => Math.max(prev - 1, 0));

  const onSubmit = (data) => {
    console.log("Form submitted:", data);
    // Handle form submission
  };

  // Step-specific validation
  const isStepValid = () => {
    const errors = form.formState.errors;
    switch (step) {
      case 0: // Step 1
        return !errors.basicInfo;
      case 1: // Step 2
        return !errors.requirements;
      case 2: // Step 3
        return !errors.description;
      case 3: // Step 4
        return !errors.skills;
      default:
        return true;
    }
  };

  const steps = [
    <Step1BasicInfo form={form} key="step1" />,
    <Step2Requirements form={form} key="step2" />,
    <Step3Description form={form} key="step3" />,
    <Step4Skills form={form} key="step4" />,
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-brand mb-8">Create Job Posting</h1>
        <ProgressStepper currentStep={step} totalSteps={totalSteps} />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {steps[step]}
            <FormNavigation
              step={step}
              totalSteps={totalSteps}
              onNext={handleNext}
              onBack={handleBack}
              isValid={isStepValid()}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};