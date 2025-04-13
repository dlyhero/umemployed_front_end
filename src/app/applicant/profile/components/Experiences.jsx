'use client';

import { useState } from 'react';
import { AddItemModal } from './AddItemModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const ExperienceSection = () => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [experiences, setExperiences] = useState([]);
  
  const handleAddExperience = () => {
    // Here you would typically:
    // 1. Get form data
    // 2. Validate inputs
    // 3. Add to experiences array
    // 4. Close modal
    
    // For now we'll just add a dummy experience
    setExperiences([...experiences, {
      id: Date.now(),
      title: 'New Experience',
      company: 'New Company',
      date: '2023 - Present'
    }]);
    
    setIsAddOpen(false);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Experience</h2>
        <Button 
          onClick={() => setIsAddOpen(true)}
          size="sm"
          className="text-brand hover:bg-transparent bg-transparent border border-brand"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Experience
        </Button>
      </div>
      
      {experiences.length === 0 ? (
        <p className="text-gray-500">No experiences added yet.</p>
      ) : (
        <div className="space-y-4">
          {experiences.map(exp => (
            <div key={exp.id} className="border-b pb-4 last:border-0">
              <h3 className="font-medium">{exp.title}</h3>
              <p className="text-gray-700">{exp.company}</p>
              <p className="text-gray-500 text-sm">{exp.date}</p>
            </div>
          ))}
        </div>
      )}
      
      <AddItemModal
        title="Add Experience"
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddExperience}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Job Title *</Label>
            <Input id="title" placeholder="e.g. Software Engineer" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company">Company *</Label>
            <Input id="company" placeholder="e.g. Tech Corp" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" placeholder="Describe your role" rows={4} />
          </div>
        </div>
      </AddItemModal>
    </Card>
  );
};