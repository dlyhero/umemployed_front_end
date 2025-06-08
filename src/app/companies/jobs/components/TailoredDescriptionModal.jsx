'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export const TailoredDescriptionModal = ({ isOpen, onClose, jobId, onSubmitSkills, isLoading }) => {
  const [skills, setSkills] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

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
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.3 }}
      >
        <DialogContent className="w-full sm:max-w-lg p-6 bg-white dark:bg-gray-800 rounded-xl shadow-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-gray-900 dark:text-gray-100">
              <Sparkles className="h-6 w-6 text-brand" />
              Generate AI-Powered Job Description
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-300 mt-2">
              Create a compelling job description tailored to your needs. Enter key skills below, and our AI will generate a professional description optimized to attract top candidates.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <label htmlFor="skills" className="text-sm font-medium text-gray-700 dark:text-gray-200">
                  Required Skills (comma-separated)
                </label>
                <Textarea
                  id="skills"
                  value={skills}
                  onChange={(e) => setSkills(e.target.value)}
                  placeholder="e.g., Pyspark, Machine Learning, Generative AI"
                  className="w-full min-h-[120px] bg-gray-50 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100 text-base resize-none"
                  rows={5}
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
              </div>
              <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg text-sm text-gray-600 dark:text-gray-300">
                <p className="font-medium">Why use this feature?</p>
                <ul className="list-disc pl-4 space-y-1 mt-2">
                  <li>Saves time with instant, high-quality descriptions</li>
                  <li>Optimized to attract qualified candidates</li>
                  <li>Customized based on your specified skills</li>
                </ul>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isLoading}
                className="w-full sm:w-auto border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full sm:w-auto bg-brand hover:bg-brand/90 text-white"
              >
                {isLoading ? 'Generating...' : 'Generate Description'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </motion.div>
    </Dialog>
  );
};

export default TailoredDescriptionModal;