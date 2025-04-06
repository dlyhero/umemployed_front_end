// /job/components/FormNavigation.jsx
'use client';
import { Button } from '@/components/ui/button';

export const FormNavigation = ({ step, nextStep, prevStep, isSubmitting, isValid }) => {
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
      {step < 4 ? (
        <Button
          type="button"
          onClick={nextStep}
          disabled={!isValid}
          className="bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90"
        >
          Next
        </Button>
      ) : (
        <Button
          type="submit"
          disabled={isSubmitting || !isValid}
          className="bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90"
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      )}
    </div>
  );
};