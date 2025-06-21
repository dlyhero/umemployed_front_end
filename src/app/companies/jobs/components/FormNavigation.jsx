// src/app/companies/jobs/components/FormNavigation.jsx
'use client';
import { Button } from '@/components/ui/button';
import { useJobStore } from '../../../../store/jobStore';
import { useRouter } from 'next/navigation';

export const FormNavigation = ({ step, nextStep, prevStep, isSubmitting, isValid }) => {
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
        >
          Back
        </Button>
      )}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="destructive"
          onClick={handleCancel}
          className="bg-red-500 text-white hover:bg-red-600"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90 flex items-center"
        >
          {isSubmitting ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Creating...
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