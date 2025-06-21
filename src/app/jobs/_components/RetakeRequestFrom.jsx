import { Button } from '@/components/ui/button';

export const RetakeRequestForm = ({ 
  retakeReason, 
  setRetakeReason, 
  submitRetakeRequest, 
  onClose 
}) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Request Assessment Retake</h2>
      <p className="text-muted-foreground">
        Please explain why you need to retake this assessment. We'll review your request and get back to you.
      </p>

      <textarea
        className="w-full border rounded-lg p-4 min-h-[200px]"
        value={retakeReason}
        onChange={(e) => setRetakeReason(e.target.value)}
        placeholder="Enter your reasons here..."
      />

      <div className="flex gap-4">
        <Button
          className="border-brand text-brand hover:text-brand flex-1"
          variant="outline"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 bg-brand hover:bg-brand/80 text-white"
          onClick={submitRetakeRequest}
          disabled={!retakeReason.trim()}
        >
          Submit Request
        </Button>
      </div>
    </div>
  );
};