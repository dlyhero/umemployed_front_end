// src/app/companies/jobs/create/description/DescriptionContent.jsx
'use client';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormContainer } from '../../components/FormContainer';
import { useJobForm } from '../../../../../hooks/useJobForm';
import { TailoredDescriptionModal } from '../../components/TailoredDescriptionModal';
import SubscriptionModal from '../../../../../components/common/modal/Recruiter-Subscription-modal';
import { Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSession } from 'next-auth/react';
import { checkSubscriptionStatus } from '../../../../../../lib/api/recruiter_subscribe';
import { toast } from 'react-hot-toast';

function DescriptionInner() {
  const currentStep = 'description';
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();
  const { step, form, onSubmit, stepIsValid, prevStep, jobOptions, extractedSkills, isLoadingOptions, isLoadingSkills, jobId, generateTailoredDescription, isGeneratingDescription } = useJobForm(currentStep);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!jobId) {
      toast.error('Please complete the Basic Information step first.');
      router.push('/companies/jobs/create/basicinformation');
    }
  }, [jobId, router]);

  const checkSubscription = async () => {
    if (!session?.user?.user_id || !session?.accessToken) {
      return { has_active_subscription: false, tier: 'basic', error: 'No user ID or token found' };
    }
    try {
      const statusResponse = await checkSubscriptionStatus(
        session.user.user_id,
        'recruiter',
        session.accessToken
      );
      return statusResponse;
    } catch (error) {
      return { has_active_subscription: false, tier: 'basic', error: 'Failed to check subscription' };
    }
  };

  const handleAIGenerateClick = async () => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to use this feature.');
      router.push('/auth/signin');
      return;
    }
    const subscriptionStatus = await checkSubscription();
    if (!subscriptionStatus.has_active_subscription || subscriptionStatus.tier.toLowerCase() !== 'premium') {
      setSubscriptionError('To use this feature, you must upgrade to a Premium plan.');
      setShowSubscriptionModal(true);
      return;
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const result = await onSubmit(data);
      if (result?.error) {
        toast.error(result.error);
        return result;
      }
      toast.success('Description saved successfully!');
      // Delay to show spinner before navigation
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push(`/companies/jobs/create/skills?jobId=${jobId}`);
      return result;
    } catch (error) {
      toast.error('Failed to save description');
      return { error: error.message };
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateDescription = async (skills) => {
    try {
      await generateTailoredDescription(skills);
    } catch (error) {
      throw error;
    }
  };

  if (!jobId) {
    return (
      <div className="text-center p-6">
        <p>Redirecting to Basic Information...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      <SubscriptionModal
        isOpen={showSubscriptionModal}
        onClose={() => setShowSubscriptionModal(false)}
        errorMessage={subscriptionError}
      />
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="absolute top-6 right-6 md:top-12 md:right-100 transform translate-x-1/2 translate-y-1/2 z-10"
      >
        <Button
          variant="outline"
          size="lg"
          className="flex items-center gap-2 bg-[#1e90ff]/10 hover:bg-[#1e90ff]/20 border border-[#1e90ff]/50 hover:border-[#1e90ff] rounded-full px-4 py-3 shadow-md hover:shadow-lg transition-all"
          onClick={handleAIGenerateClick}
          disabled={isGeneratingDescription || isSubmitting}
        >
          <span className="text-2xl text-[#1e90ff]">⚡️</span>
          <span className="text-sm font-medium text-[#1e90ff]">AI Generate Description</span>
        </Button>
      </motion.div>
      <FormContainer
        step={step}
        form={form}
        nextStep={() => form.handleSubmit(handleSubmit)()}
        prevStep={prevStep}
        onSubmit={handleSubmit}
        stepIsValid={stepIsValid}
        jobOptions={jobOptions}
        extractedSkills={extractedSkills}
        isLoadingSkills={isLoadingSkills}
        isLoadingOptions={isLoadingOptions}
      />
      <TailoredDescriptionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        jobId={jobId}
        onSubmitSkills={handleGenerateDescription}
        isLoading={isGeneratingDescription}
      />
    </div>
  );
}

export default function Description() {
  return (
    <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
      <DescriptionInner />
    </Suspense>
  );
}