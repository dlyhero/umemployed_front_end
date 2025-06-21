import { Button } from '@/src/components/ui/button';

export const RetakeModal = ({ isMobileView, onClose, children }) => {
  if (isMobileView) {
    return (
      <div className="fixed inset-0 bg-white z-50 p-4 overflow-y-auto">
        <div className="container mx-auto">
          <Button
            variant="ghost"
            className="mb-4 gap-1.5 px-0 hover:bg-transparent"
            onClick={onClose}
          >
            <ChevronLeft className="h-5 w-5" />
            Back to job
          </Button>
          <div className="max-w-md mx-auto">
            {children}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        {children}
      </div>
    </div>
  );
};