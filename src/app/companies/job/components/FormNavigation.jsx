// /job/components/FormNavigation.jsx
import { Button } from "@/components/ui/button";

export const FormNavigation = ({ step, totalSteps, onNext, onBack, isValid }) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onBack}
        disabled={step === 0}
      >
        Back
      </Button>
      {step === totalSteps - 1 ? (
        <Button type="submit" className="bg-brand text-white" disabled={!isValid}>
          Submit
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onNext}
          className="bg-brand text-white"
          disabled={!isValid}
        >
          Next
        </Button>
      )}
    </div>
  );
};