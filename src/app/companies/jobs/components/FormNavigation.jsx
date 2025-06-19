// src/app/companies/jobs/components/FormNavigation.jsx
'use client';
import { Button } from '@/components/ui/button';
import { useJobStore } from '../../../../store/jobStore';
import { useRouter } from 'next/navigation';

export const FormNavigation = ({ step, nextStep, prevStep, isSubmitting, isValid, isLoading }) => {
  const { clearStore } = useJobStore();
  const router = useRouter();

  const handleCancel = () => {
    clearStore();
    router.push('/companies/jobs');
  };

  return (
    <div className="flex justify-between mt-6">
      {step > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={prevStep}
          className="border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10"
          disabled={isSubmitting || isLoading}
        >
          Back
        </Button>
      )}
      <div className="flex gap-2 items-center">
        <Button
          type="button"
          variant="destructive"
          onClick={handleCancel}
          className="bg-red-500 text-white hover:bg-red-600"
          disabled={isSubmitting || isLoading}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isValid || isLoading}
          className="bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90 flex items-center gap-2"
        >
          {isSubmitting || isLoading ? (
            <>
              <div className="spinner"></div>
              {isSubmitting ? 'Creating...' : 'Loading...'}
            </>
          ) : step < 4 ? (
            'Next'
          ) : (
            'Submit'
          )}
        </Button>
      </div>
    </div>
  );
};