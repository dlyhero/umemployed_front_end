'use client';

import { GraduationCap, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddItemModal } from './AddItemModal';
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { EditModal } from './EditModal';

export const EducationSection = ({ educations = [], isOwner }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  
  const handleAddEducation = (newEducation) => {
    // In a real app, you would update state or make an API call here
    console.log('Adding education:', newEducation);
    setIsAddOpen(false);
  };

  const handleEditEducation = (updatedEducation) => {
    // In a real app, you would update state or make an API call here
    console.log('Updating education:', updatedEducation);
    setEditingEducation(null);
  };

  const handleDeleteEducation = (id) => {
    // In a real app, you would update state or make an API call here
    console.log('Deleting education with id:', id);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <GraduationCap className="text-gray-700 h-5 w-5" />
          <h2 className="text-xl font-bold text-gray-900">Education</h2>
        </div>

        {isOwner && (
          <Button 
            onClick={() => setIsAddOpen(true)}
            variant="ghost" 
            size="sm" 
            className="text-brand hover:text-brand"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {educations.length > 0 ? (
          educations.map((edu) => (
            <div key={edu.id} className="flex gap-4 group relative">
              <div className="flex-shrink-0 mt-1">
                <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center">
                  <GraduationCap className="text-brand h-5 w-5" />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">{edu.school}</h3>
                    <p className="text-gray-700">{edu.degree}</p>
                    <p className="text-gray-500 text-sm">
                      {edu.startYear} - {edu.endYear || 'Present'}
                    </p>
                    {edu.fieldOfStudy && (
                      <p className="text-gray-700 mt-1">Field of study: {edu.fieldOfStudy}</p>
                    )}
                    {edu.description && (
                      <p className="text-gray-700 mt-2 whitespace-pre-line">{edu.description}</p>
                    )}
                  </div>
                  
                  {isOwner && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-brand hover:text-brand"
                        onClick={() => setEditingEducation(edu)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <GraduationCap className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No education added</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isOwner ? 'Add your education history to showcase to recruiters.' : 'No education information available.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Education Modal */}
      <AddItemModal
        title="Add Education"
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddEducation}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="school">School *</Label>
            <Input id="school" placeholder="e.g. Stanford University" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="degree">Degree *</Label>
            <Input id="degree" placeholder="e.g. Bachelor's Degree" required />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startYear">Start Year *</Label>
              <Input id="startYear" placeholder="e.g. 2015" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endYear">End Year (or expected)</Label>
              <Input id="endYear" placeholder="e.g. 2019" />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fieldOfStudy">Field of Study</Label>
            <Input id="fieldOfStudy" placeholder="e.g. Computer Science" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input id="description" placeholder="Any achievements or specializations" />
          </div>
        </div>
      </AddItemModal>

      {/* Edit Education Modal */}
      {editingEducation && (
        <EditModal
          title="Edit Education"
          open={!!editingEducation}
          onOpenChange={(open) => !open && setEditingEducation(null)}
          onSave={handleEditEducation}
          defaultValues={editingEducation}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-school">School *</Label>
              <Input 
                id="edit-school" 
                defaultValue={editingEducation.school}
                placeholder="e.g. Stanford University" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-degree">Degree *</Label>
              <Input 
                id="edit-degree" 
                defaultValue={editingEducation.degree}
                placeholder="e.g. Bachelor's Degree" 
                required 
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-startYear">Start Year *</Label>
                <Input 
                  id="edit-startYear" 
                  defaultValue={editingEducation.startYear}
                  placeholder="e.g. 2015" 
                  required 
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-endYear">End Year (or expected)</Label>
                <Input 
                  id="edit-endYear" 
                  defaultValue={editingEducation.endYear}
                  placeholder="e.g. 2019" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-fieldOfStudy">Field of Study</Label>
              <Input 
                id="edit-fieldOfStudy" 
                defaultValue={editingEducation.fieldOfStudy}
                placeholder="e.g. Computer Science" 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Description</Label>
              <Input 
                id="edit-description" 
                defaultValue={editingEducation.description}
                placeholder="Any achievements or specializations" 
              />
            </div>
          </div>
        </EditModal>
      )}
    </Card>
  );
};