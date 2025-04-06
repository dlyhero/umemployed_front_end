// /job/components/FormContainer.jsx
'use client';
import { Form } from '@/components/ui/form';
import { ProgressStepper } from './ProgressStepper';
import { Step1BasicInfo } from './Step1BasicInfo';
import { Step2Requirements } from './Step2Requirements';
import { Step3Description } from './Step3Description';
import { Step4Skills } from './Step4Skills';
import { FormNavigation } from './FormNavigation';

export const FormContainer = ({ step, form, nextStep, prevStep, onSubmit, stepIsValid }) => {
  // Debug: Log stepIsValid to verify it's a function
  console.log('stepIsValid in FormContainer:', stepIsValid);

  return (
    <main className="container mx-auto p-6 bg-white rounded-lg shadow-md max-w-2xl mt-5">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">Post a New Job</h2>
        <p className="text-gray-600 mt-1">Fill in the details to create a job posting.</p>
      </div>
      <ProgressStepper step={step} />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && <Step1BasicInfo form={form} />}
          {step === 2 && <Step2Requirements form={form} />}
          {step === 3 && <Step3Description form={form} />}
          {step === 4 && <Step4Skills form={form} />}
          <FormNavigation
            step={step}
            nextStep={nextStep}
            prevStep={prevStep}
            isSubmitting={form.formState.isSubmitting}
            isValid={typeof stepIsValid === 'function' ? stepIsValid() : false} // Ensure stepIsValid is a function
          />
        </form>
      </Form>
    </main>
  );
};