'use client';

import { GraduationCap, Edit, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddItemModal } from './AddItemModal';
import { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';
import { useSession } from 'next-auth/react';
import useUser from '@/src/hooks/useUser';

export const EducationSection = ({ educations = [], isOwner }) => {
  const { data: session } = useSession();
  const [userEducations, setEducations] = useState(educations);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAll, setShowAll] = useState(false);
  const formRef = useRef(null);
  const { user } = useUser();
  
  // Limits and display
  const MAX_EDUCATIONS = 20;
  const initialVisibleCount = 3;
  const visibleEducations = showAll ? userEducations : userEducations.slice(0, initialVisibleCount);

  const canAddMore = () => {
    if (userEducations.length >= MAX_EDUCATIONS) {
      toast.error(`Maximum limit reached`, {
        description: `You can only have up to ${MAX_EDUCATIONS} education entries.`,
      });
      return false;
    }
    return true;
  };

  const validateEducation = (data) => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    
    if (!data.institution_name?.trim()) errors.institution_name = 'Institution name is required';
    if (!data.degree?.trim()) errors.degree = 'Degree is required';
    
    if (!data.graduation_year) {
      errors.graduation_year = 'Graduation year is required';
    } else if (isNaN(data.graduation_year)) {
      errors.graduation_year = 'Invalid year format';
    } else if (data.graduation_year > currentYear + 5) {
      errors.graduation_year = 'Year seems too far in the future';
    } else if (data.graduation_year < 1900) {
      errors.graduation_year = 'Year seems too far in the past';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddEducation = async (newEducation) => {
    if (!validateEducation(newEducation)) return;
    if (!canAddMore()) return;

    try {
      setIsLoading(true);
      toast.loading('Adding education...');
      
      const payload = {
        ...newEducation,
        user: user?.id
      };

      const { data } = await axios.post(`${baseUrl}/resume/educations/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setEducations([...userEducations, data]);
      setIsAddOpen(false);
      toast.success('Education added successfully');
    } catch (error) {
      console.error('Add error:', error);
      toast.error(error.response?.data?.message || 'Failed to add education');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleEditEducation = async (updatedEducation) => {
    if (!validateEducation(updatedEducation)) return;

    try {
      setIsLoading(true);
      toast.loading('Updating education...');
      
      const { data } = await axios.patch(
        `${baseUrl}/resume/educations/${updatedEducation.id}/`,
        updatedEducation,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      setEducations(userEducations.map(edu => 
        edu.id === updatedEducation.id ? data : edu
      ));
      setEditingEducation(null);
      toast.success('Education updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      toast.error(error.response?.data?.message || 'Failed to update education');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleDeleteEducation = async (id) => {
    try {
      setIsLoading(true);
      toast.loading('Deleting education...');
      
      await axios.delete(`${baseUrl}/resume/educations/${id}/`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setEducations(userEducations.filter(edu => edu.id !== id));
      toast.success('Education deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      toast.error(error.response?.data?.message || 'Failed to delete education');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleSave = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const educationData = {
      institution_name: formData.get('institution_name'),
      degree: formData.get('degree'),
      field_of_study: formData.get('field_of_study'),
      graduation_year: formData.get('graduation_year'),
      description: formData.get('description')
    };

    if (editingEducation) {
      handleEditEducation({
        ...educationData,
        id: editingEducation.id
      });
    } else {
      handleAddEducation(educationData);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <GraduationCap className="text-gray-700 h-5 w-5" />
            <h2 className="text-xl font-bold text-gray-900">Education</h2>
          </div>
          <p className="text-sm text-gray-500 ml-7">
            {userEducations.length}/{MAX_EDUCATIONS} entries
          </p>
        </div>

        {isOwner && (
          <Button 
            onClick={() => {
              if (!canAddMore()) return;
              setIsAddOpen(true);
              setEditingEducation(null);
              setValidationErrors({});
            }}
            variant="ghost" 
            size="sm" 
            className="text-brand hover:text-brand"
            disabled={isLoading || userEducations.length >= MAX_EDUCATIONS}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add
          </Button>
        )}
      </div>

      <div className="space-y-6">
        {visibleEducations.length > 0 ? (
          <>
            {visibleEducations.map((edu) => (
              <div key={edu.id} className="flex gap-4 group relative">
                <div className="flex-shrink-0 mt-1">
                  <div className="h-10 w-10 rounded-full bg-brand/10 flex items-center justify-center">
                    <GraduationCap className="text-brand h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-900">{edu.institution_name}</h3>
                      <p className="text-gray-700">{edu.degree}</p>
                      {edu.field_of_study && (
                        <p className="text-gray-700">{edu.field_of_study}</p>
                      )}
                      <p className="text-gray-500 text-sm">
                        Graduated: {edu.graduation_year}
                      </p>
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
                          onClick={() => {
                            setEditingEducation(edu);
                            setValidationErrors({});
                          }}
                          disabled={isLoading}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-600"
                          onClick={() => handleDeleteEducation(edu.id)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {userEducations.length > initialVisibleCount && (
              <div className="flex justify-center pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAll(!showAll)}
                  className="text-brand hover:text-brand"
                >
                  {showAll ? (
                    <>
                      <ChevronUp className="mr-2 h-4 w-4" />
                      Show Less
                    </>
                  ) : (
                    <>
                      <ChevronDown className="mr-2 h-4 w-4" />
                      View All ({userEducations.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
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

      <AddItemModal
        title={editingEducation ? 'Edit Education' : 'Add Education'}
        open={isAddOpen || !!editingEducation}
        onOpenChange={(open) => {
          if (!open) {
            setIsAddOpen(false);
            setEditingEducation(null);
            setValidationErrors({});
          }
        }}
        onSave={handleSave}
        initialData={editingEducation}
        isLoading={isLoading}
        disabled={userEducations.length >= MAX_EDUCATIONS && !editingEducation}
      >
        {userEducations.length >= MAX_EDUCATIONS && !editingEducation ? (
          <div className="text-center py-4">
            <p className="text-red-500">
              You've reached the maximum limit of {MAX_EDUCATIONS} education entries.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Please delete an existing entry before adding a new one.
            </p>
          </div>
        ) : (
          <form ref={formRef} className="space-y-4">
<div className="space-y-2">
  <Label htmlFor="institution_name">Institution *</Label>
  <Input 
    id="institution_name" 
    name="institution_name"
    defaultValue={editingEducation?.institution_name || ''}
    placeholder="e.g. Stanford University" 
    required
  />
  {validationErrors.institution_name && (
    <p className="text-sm text-red-500">{validationErrors.institution_name}</p>
  )}
</div>

<div className="space-y-2">
  <Label htmlFor="degree">Degree *</Label>
  <Input 
    id="degree" 
    name="degree"
    defaultValue={editingEducation?.degree || ''}
    placeholder="e.g. Bachelor's Degree" 
    required
  />
  {validationErrors.degree && (
    <p className="text-sm text-red-500">{validationErrors.degree}</p>
  )}
</div>

<div className="space-y-2">
  <Label htmlFor="field_of_study">Field of Study</Label>
  <Input 
    id="field_of_study" 
    name="field_of_study"
    defaultValue={editingEducation?.field_of_study || ''}
    placeholder="e.g. Computer Science" 
  />
</div>

<div className="space-y-2">
  <Label htmlFor="graduation_year">Graduation Year *</Label>
  <Input
    id="graduation_year"
    name="graduation_year"
    defaultValue={editingEducation?.graduation_year || ''}
    placeholder="e.g. 2015"
    required
  />
  {validationErrors.graduation_year && (
    <p className="text-sm text-red-500">{validationErrors.graduation_year}</p>
  )}
</div>

<div className="space-y-2">
  <Label htmlFor="description">Description</Label>
  <Textarea
    id="description"
    name="description"
    defaultValue={editingEducation?.description || ''}
    placeholder="Any achievements or specializations"
    rows={3}
  />
</div>
</form>
        )}
      </AddItemModal>
    </Card>
  );
};

