'use client';

import { useState } from 'react';
import { AddItemModal } from './AddItemModal';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export const ExperienceSection = ({ experiences, isOwner }) => {
  const [userExperiences, setExperiences] = useState(experiences || []);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const handleAddExperience = (newExperience) => {
    setExperiences([
      ...userExperiences,
      { ...newExperience, id: Date.now().toString() }
    ]);
    setIsAddOpen(false);
  };

  const handleEditExperience = (updatedExperience) => {
    setExperiences(
      userExperiences.map((exp) =>
        exp.id === updatedExperience.id ? updatedExperience : exp
      )
    );
    setEditingExperience(null);
  };

  const handleDeleteExperience = (id) => {
    setExperiences(userExperiences.filter((exp) => exp.id !== id));
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Experience</h2>
        {isOwner && (
          <Button
            onClick={() => {
              setEditingExperience(null);
              setIsAddOpen(true);
            }}
            size="sm"
            variant="outline"
            className="text-brand hover:bg-brand hover:text-white"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        )}
      </div>

      {userExperiences.length === 0 ? (
        <p className="text-gray-500">No experiences added yet.</p>
      ) : (
        <div className="space-y-4 max-h-96 overflow-auto">
          {userExperiences.map((exp) => (
            <div key={exp.id} className="pb-4 last:border-0 group">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{exp.role}</h3>
                  <p className="text-gray-700">{exp.company_name}</p>
                  <p className="text-gray-500 text-sm">
                    {exp.start_date} - {exp.end_date}
                  </p>
                  {exp.description && (
                    <p className="text-gray-600 mt-2 text-sm">{exp.description}</p>
                  )}
                </div>
                {isOwner && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Edit Experience"
                      onClick={() => {
                        setEditingExperience(exp);
                        setIsAddOpen(true);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete Experience"
                      onClick={() => handleDeleteExperience(exp.id)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {isOwner && (
        <AddItemModal
          title={editingExperience ? 'Edit Experience' : 'Add Experience'}
          open={isAddOpen || !!editingExperience}
          onOpenChange={(open) => {
            if (!open) {
              setIsAddOpen(false);
              setEditingExperience(null);
            }
          }}
          onSave={(formData) => {
            const experienceData = {
              id: editingExperience?.id || Date.now().toString(),
              role: formData.get('title'),
              company_name: formData.get('company'),
              start_date: formData.get('start_date'),
              end_date: formData.get('end_date'),
              description: formData.get('description')
            };

            if (editingExperience) {
              handleEditExperience(experienceData);
            } else {
              handleAddExperience(experienceData);
            }
          }}
          initialData={editingExperience}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingExperience?.role || ''}
                placeholder="e.g. Software Engineer"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                name="company"
                defaultValue={editingExperience?.company_name || ''}
                placeholder="e.g. Tech Corp"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Year *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  defaultValue={editingExperience?.start_date || ''}
                  placeholder="e.g. 2015"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Year (or expected)</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  defaultValue={editingExperience?.end_date || ''}
                  placeholder="e.g. 2019"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={editingExperience?.description || ''}
                placeholder="Describe your role and achievements"
                rows={4}
              />
            </div>
          </div>
        </AddItemModal>
      )}
    </Card>
  );
};
