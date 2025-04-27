import { Suspense } from 'react';
import SkillsContent from './SkillsContent';

export default function SkillsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SkillsContent />
    </Suspense>
  );
}
