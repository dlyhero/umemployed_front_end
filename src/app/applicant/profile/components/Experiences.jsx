'use client';

import { useState, useRef } from 'react';
import { AddItemModal } from './AddItemModal';
import { Button } from '@/components/ui/button';
import { Plus, Pencil, Trash2, ChevronDown, ChevronUp, BriefcaseIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';
import { useSession } from 'next-auth/react';

export const ExperienceSection = ({ experiences, isOwner }) => {
  const { data: session } = useSession();
  const [userExperiences, setExperiences] = useState(experiences || []);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAll, setShowAll] = useState(false);
  const formRef = useRef(null);

  // Constants for limits
  const MAX_EXPERIENCES = 15;
  const initialVisibleCount = 3;
  const visibleExperiences = showAll ? userExperiences : userExperiences.slice(0, initialVisibleCount);

  // Format date as YYYY-MM-DD (API format)
  const formatDateForAPI = (year) => {
    if (!year) return null;
    return `${year}-01-01`;
  };

  // Extract year from date string for display
  const getYearFromDate = (dateString) => {
    if (!dateString) return '';
    return dateString.includes('-') ? dateString.split('-')[0] : dateString;
  };

  // Check if user can add more experiences
  const canAddMoreExperiences = () => {
    if (userExperiences.length >= MAX_EXPERIENCES) {
      toast.error(`Maximum limit reached`, {
        description: `You can only have up to ${MAX_EXPERIENCES} experiences.`,
      });
      return false;
    }
    return true;
  };

  const validateExperience = (data) => {
    const errors = {};
    const currentYear = new Date().getFullYear();
    const startYear = parseInt(data.start_date);
    const endYear = data.end_date ? parseInt(data.end_date) : null;

    if (!data.role?.trim()) errors.role = 'Job title is required';
    if (!data.company_name?.trim()) errors.company_name = 'Company name is required';
    
    if (!data.start_date) {
      errors.start_date = 'Start year is required';
    } else if (isNaN(startYear)) {
      errors.start_date = 'Invalid year format';
    } else if (startYear > currentYear) {
      errors.start_date = 'Start year cannot be in the future';
    } else if (startYear < 1900) {
      errors.start_date = 'Start year must be after 1900';
    }

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
    if (!canAddMoreExperiences()) return;

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
    <div className="p-6 border-b bg-white   border rounded-xl max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h4 className="text-xl font-bold text-gray-800 mb-2">Work Experience</h4>
          <p className="text-sm text-gray-500">
            {userExperiences.length}/{MAX_EXPERIENCES} experiences added
          </p>
        </div>
        {isOwner && (
          <Button
            onClick={() => {
              if (!canAddMoreExperiences()) return;
              setEditingExperience(null);
              setIsAddOpen(true);
              setValidationErrors({});
            }}
            size="sm"
            variant="outline"
            className="text-brand hover:bg-white p-6 rounded-full border-brand hover:text-brand"
            disabled={isLoading || userExperiences.length >= MAX_EXPERIENCES}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Experience
          </Button>
        )}
      </div>

      {userExperiences.length === 0 ? (
        <p className="text-gray-500">No experiences added yet.</p>
      ) : (
        <div className="block-archive-inner candidate-single-field">
          {visibleExperiences.map((exp) => (
            <div key={exp.id} className="single candidate-experience mb-6 last:mb-0 group relative">
              <div className="experience-title time-dot relative pl-6 mb-2">
                {/* Timeline dot */}
                <div className="absolute left-0 top-1 w-3 h-3 bg-brand rounded-full border-2 border-white shadow-md"></div>
                {/* Timeline line */}
                <div className="absolute left-1.5 top-4 w-0.5 h-full bg-gray-200 -z-10"></div>
                
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-gray-800 text-lg">{exp.role}</h3>
                  
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
              
              <div className="experience-details time-line pl-6">
                <div className="flex flex-wrap items-center gap-2 text-gray-600 mb-2">
                  <span className="font-medium">{exp.company_name}</span>
                  <span className="text-gray-400">•</span>
                  <span>{getYearFromDate(exp.start_date)}</span>
                  <span>-</span>
                  <span>{exp.end_date ? getYearFromDate(exp.end_date) : 'Present'}</span>
                </div>
                
                {exp.description && (
                  <span className="des block text-gray-600 text-sm leading-relaxed">
                    {exp.description}
                  </span>
                )}
              </div>
            </div>
          ))}

          {userExperiences.length > initialVisibleCount && (
            <div className="flex justify-center pt-4">
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
                    View All ({userExperiences.length})
                  </>
                )}
              </Button>
            </div>
          )}
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
          disabled={userExperiences.length >= MAX_EXPERIENCES && !editingExperience}
        >
          {userExperiences.length >= MAX_EXPERIENCES && !editingExperience ? (
            <div className="text-center py-4">
              <p className="text-red-500">
                You've reached the maximum limit of {MAX_EXPERIENCES} experiences.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Please delete an existing experience before adding a new one.
              </p>
            </div>
          ) : (
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
          )}
        </AddItemModal>
      )}
    </div>
  );
};