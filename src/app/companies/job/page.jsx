'use client';
import { FormContainer } from './components/FormContainer';

export default function JobPostingPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-brand mb-8"> Job Posting</h1>
      <FormContainer />
    </div>
  );
}