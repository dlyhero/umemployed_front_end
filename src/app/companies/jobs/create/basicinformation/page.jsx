'use client';
import { useRouter, useParams } from 'next/navigation';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';
import { Suspense, useState } from 'react';
import SubscriptionModal from '../../../../../components/common/modal/Recruiter-Subscription-modal';

function JobPostingContent() {
  const router = useRouter();
  const { companyId } = useParams();
  const {
    step,
    form,
    onSubmit: handleSubmit,
    stepIsValid,
    nextStep,
    prevStep,
    jobOptions,
    extractedSkills,
    isLoadingOptions,
    isLoadingSkills,
    isSubmittingStep1,
    showSubscriptionModal,
    setShowSubscriptionModal,
    subscriptionError,
  } = useJobForm('basicinformation');

  const onSubmit = async (data) => {
    try {
      const result = await handleSubmit(data);
      if (result?.error) {
        return { error: result.error };
      }
      if (!result?.id) {
        return { error: 'No job ID returned' };
      }
      await nextStep(result.id);
      return { success: true, jobId: result.id };
    } catch (error) {
      return { error: error.message };
    }
  };

  if (isSubmittingStep1) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-[#1e90ff]"></div>
        <p className="ml-4 text-white text-lg">Creating job...</p>
      </div>
    );
  }

  return (
    <>
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        errorMessage={subscriptionError}
      />
      <FormContainer
        step={step}
        form={form}
        nextStep={() => form.handleSubmit(onSubmit)()}
        prevStep={prevStep}
        onSubmit={onSubmit}
        stepIsValid={stepIsValid}
        jobOptions={jobOptions}
        extractedSkills={extractedSkills}
        isLoadingSkills={isLoadingSkills}
        isLoadingOptions={isLoadingOptions}
      />
    </>
  );
}

export default function JobPostingPage() {
  return (
    <Suspense
      fallback={
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#1e90ff]"></div>
        </div>
      }
    >
      <JobPostingContent />
    </Suspense>
  );
}