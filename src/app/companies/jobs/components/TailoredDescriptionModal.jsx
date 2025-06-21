// src/app/companies/jobs/components/TailoredDescriptionModal.jsx
'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export const TailoredDescriptionModal = ({ isOpen, onClose, jobId, onSubmitSkills, isLoading }) => {
  const [skills, setSkills] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Split skills by commas and trim whitespace
    const skillsArray = skills
      .split(',')
      .map((skill) => skill.trim())
      .filter((skill) => skill);

    if (skillsArray.length === 0) {
      setError('Please enter at least one skill.');
      return;
    }

    try {
      await onSubmitSkills(skillsArray);
      toast.success('Tailored description generated successfully!');
      onClose();
    } catch (error) {
      setError(error.message || 'Failed to generate tailored description.');
      toast.error(error.message || 'Failed to generate tailored description.');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <span className="text-brand">⚡️</span>
            Generate AI-Powered Job Description
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="skills" className="text-sm font-medium">
                Required Skills (comma-separated)
              </label>
              <Input
                id="skills"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g., Pyspark, Machine Learning, Generative AI"
                className="w-full"
              />
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="bg-brand hover:bg-brand-600 text-white">
              {isLoading ? 'Generating...' : 'Generate Description'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TailoredDescriptionModal;
