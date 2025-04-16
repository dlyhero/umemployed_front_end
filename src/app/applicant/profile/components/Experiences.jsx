'use client';

import { useState, useRef } from 'react';
import { AddItemModal } from './AddItemModal';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';
import { useSession } from 'next-auth/react';
import useUser from '@/src/hooks/useUser';

export const ExperienceSection = ({ experiences, isOwner }) => {
  const { data: session } = useSession();
  const [userExperiences, setExperiences] = useState(experiences || []);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const formRef = useRef(null);
  

  // Format date as YYYY-MM-DD (API format)
  const formatDateForAPI = (year) => {
    if (!year) return null;
    return `${year}-01-01`; // Using first day of year if only year is provided
  };

  // Extract year from date string for display
  const getYearFromDate = (dateString) => {
    if (!dateString) return '';
    return dateString.includes('-') ? dateString.split('-')[0] : dateString;
  };

  // Validate experience data before submission
  const validateExperience = (data) => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(data.start_date);
    const endYear = data.end_date ? parseInt(data.end_date) : null;

    // Required fields
    if (!data.role?.trim()) errors.role = 'Job title is required';
    if (!data.company_name?.trim()) errors.company_name = 'Company name is required';
    
    // Start date validation
    if (!data.start_date) {
      errors.start_date = 'Start year is required';
    } else if (isNaN(startYear)) {
      errors.start_date = 'Invalid year format';
    } else if (startYear > currentYear) {
      errors.start_date = 'Start year cannot be in the future';
    } else if (startYear < 1900) {
      errors.start_date = 'Start year must be after 1900';
    }

    // End date validation
    if (endYear) {
      if (isNaN(endYear)) {
        errors.end_date = 'Invalid year format';
      } else if (endYear > currentYear) {
        errors.end_date = 'End year cannot be in the future';
      } else if (endYear < 1900) {
        errors.end_date = 'End year must be after 1900';
      } else if (endYear < startYear) {
        errors.end_date = 'End year cannot be before start year';
      }
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddExperience = async (newExperience) => {
    if (!validateExperience(newExperience)) return;

    try {
      setIsLoading(true);
      toast.loading('Adding experience...');
      
      const payload = {
        ...newExperience,
        start_date: formatDateForAPI(newExperience.start_date),
        end_date: newExperience.end_date ? formatDateForAPI(newExperience.end_date) : null,
        
      };

      const { data } = await axios.post(`${baseUrl}/resume/work-experiences/`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setExperiences([...userExperiences, data]);
      setIsAddOpen(false);
      toast.success('Experience added successfully');
    } catch (error) {
      console.error('Add error:', error);
      let errorMessage = 'Failed to add experience';
      
     

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleEditExperience = async (updatedExperience) => {
    if (!validateExperience(updatedExperience)) return;

    try {
      setIsLoading(true);
      toast.loading('Updating experience...');
      
      const payload = {
        ...updatedExperience,
        start_date: formatDateForAPI(updatedExperience.start_date),
        end_date: updatedExperience.end_date ? formatDateForAPI(updatedExperience.end_date) : null,
      };

      const { data } = await axios.patch(
        `${baseUrl}/resume/work-experiences/${updatedExperience.id}/`,
        payload,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session?.accessToken}`,
          },
        }
      );

      setExperiences(userExperiences.map(exp => 
        exp.id === updatedExperience.id ? data : exp
      ));
      setEditingExperience(null);
      toast.success('Experience updated successfully');
    } catch (error) {
      console.error('Update error:', error);
      let errorMessage = 'Failed to update experience';
      
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'object'
          ? Object.values(error.response.data).flat().join(', ')
          : error.response.data;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleDeleteExperience = async (id) => {
    try {
      setIsLoading(true);
      toast.loading('Deleting experience...');
      
      await axios.delete(`${baseUrl}/resume/work-experiences/${id}/`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setExperiences(userExperiences.filter(exp => exp.id !== id));
      toast.success('Experience deleted successfully');
    } catch (error) {
      console.error('Delete error:', error);
      let errorMessage = 'Failed to delete experience';
      
      if (error.response?.data) {
        errorMessage = typeof error.response.data === 'object'
          ? Object.values(error.response.data).flat().join(', ')
          : error.response.data;
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleSave = () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const experienceData = {
      role: formData.get('title'),
      company_name: formData.get('company'),
      start_date: formData.get('start_date'),
      end_date: formData.get('end_date'),
      description: formData.get('description')
    };

    if (editingExperience) {
      handleEditExperience({
        ...experienceData,
        id: editingExperience.id
      });
    } else {
      handleAddExperience(experienceData);
    }
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
              setValidationErrors({});
            }}
            size="sm"
            variant="outline"
            className="text-brand hover:bg-white hover:text-brand"
            disabled={isLoading}
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
                    {getYearFromDate(exp.start_date)} - {exp.end_date ? getYearFromDate(exp.end_date) : 'Present'}
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
                        setValidationErrors({});
                      }}
                      disabled={isLoading}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      aria-label="Delete Experience"
                      onClick={() => handleDeleteExperience(exp.id)}
                      disabled={isLoading}
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
              setValidationErrors({});
            }
          }}
          onSave={handleSave}
          initialData={editingExperience}
          isLoading={isLoading}
        >
          <form ref={formRef} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Job Title *</Label>
              <Input
                id="title"
                name="title"
                defaultValue={editingExperience?.role || ''}
                placeholder="e.g. Software Engineer"
                required
              />
              {validationErrors.role && (
                <p className="text-sm text-red-500">{validationErrors.role}</p>
              )}
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
              {validationErrors.company_name && (
                <p className="text-sm text-red-500">{validationErrors.company_name}</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Year *</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  defaultValue={editingExperience ? getYearFromDate(editingExperience.start_date) : ''}
                  placeholder="e.g. 2015"
                  required
                />
                {validationErrors.start_date && (
                  <p className="text-sm text-red-500">{validationErrors.start_date}</p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="end_date">End Year (or leave blank for present)</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  defaultValue={editingExperience ? getYearFromDate(editingExperience.end_date) : ''}
                  placeholder="e.g. 2019"
                />
                {validationErrors.end_date && (
                  <p className="text-sm text-red-500">{validationErrors.end_date}</p>
                )}
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
          </form>
        </AddItemModal>
      )}
    </Card>
  );
};