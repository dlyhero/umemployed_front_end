'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

export const EditModal = ({
  title,
  open,
  onOpenChange,
  children,
  onSave,
  isLoading = false,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-brand">{title}</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {children}
        </div>
        
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button onClick={onSave} disabled={isLoading} className="bg-brand hover:bg-brand/90 text-white">
            {isLoading ? 'Saving...' : 'Save changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};