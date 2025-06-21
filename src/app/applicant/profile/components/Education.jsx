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

  const formatDateRange = (edu) => {
    if (edu.start_date && edu.end_date) {
      return `${edu.start_date} - ${edu.end_date}`;
    } else if (edu.graduation_year) {
      return `Graduated: ${edu.graduation_year}`;
    }
    return '';
  };

  return (
    <div className="block-archive-inner candidate-single-field border rounded-xl max-w-2xl ">
      <div className="flex justify-between items-center mb-4">
        <h4 className="title-candidate">Education</h4>
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
            className="text-brand/90 hover:text--brand rounded-full border p-6 border-brand"
            disabled={isLoading || userEducations.length >= MAX_EDUCATIONS}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add ({userEducations.length}/{MAX_EDUCATIONS})
          </Button>
        )}
      </div>

      {visibleEducations.length > 0 ? (
        <>
          {visibleEducations.map((edu) => (
            <div key={edu.id} className="single candidate-education group relative">
              <div className="education-title time-dot">
                {edu.institution_name}
                {isOwner && (
                  <div className="inline-flex gap-2 ml-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-brand/90 hover:text--brand"
                      onClick={() => {
                        setEditingEducation(edu);
                        setValidationErrors({});
                      }}
                      disabled={isLoading}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteEducation(edu.id)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
              <div className="education-details time-line">
                <span>{edu.degree}</span>
                {edu.field_of_study && <span>{edu.field_of_study}</span>}
                {edu.start_date && <span>{edu.start_date}</span>}
                {edu.start_date && edu.end_date && <span>-</span>}
                {edu.end_date && <span>{edu.end_date}</span>}
                {!edu.start_date && !edu.end_date && edu.graduation_year && (
                  <span>Graduated: {edu.graduation_year}</span>
                )}
                {edu.description && <span className="des">{edu.description}</span>}
              </div>
            </div>
          ))}

          {userEducations.length > initialVisibleCount && (
            <div className="flex justify-center pt-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAll(!showAll)}
                className="text-brand/90 hover:text--brand"
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

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="start_date">Start Date</Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  defaultValue={editingEducation?.start_date || ''}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  defaultValue={editingEducation?.end_date || ''}
                />
              </div>
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

      <style jsx>{`
        .block-archive-inner {
          background: #fff;
          padding: 30px;
          border-radius: 8px;
          margin-bottom: 30px;
        }

        .title-candidate {
          font-size: 22px;
          font-weight: 600;
          color: #333;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid #f0f0f0;
        }

        .single.candidate-education {
          position: relative;
          padding-left: 30px;
          margin-bottom: 30px;
        }

        .single.candidate-education:last-child {
          margin-bottom: 0;
        }

        .education-title.time-dot {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin-bottom: 10px;
          position: relative;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .education-title.time-dot::before {
          content: '';
          position: absolute;
          left: -22px;
          top: 50%;
          transform: translateY(-50%);
          width: 12px;
          height: 12px;
          background: #007bff;
          border-radius: 50%;
          border: 3px solid #fff;
          box-shadow: 0 0 0 3px #007bff;
        }

        .education-details.time-line {
          position: relative;
          padding-left: 0;
        }

        .single.candidate-education::after {
          content: '';
          position: absolute;
          left: -16px;
          top: 25px;
          bottom: -30px;
          width: 2px;
          background: #e0e0e0;
        }

        .single.candidate-education:last-child::after {
          display: none;
        }

        .education-details.time-line span {
          display: inline-block;
          margin-right: 10px;
          color: #666;
          font-size: 14px;
        }

        .education-details.time-line span:first-child {
          font-weight: 500;
          color: #333;
          font-size: 16px;
        }

        .education-details.time-line span.des {
          display: block;
          margin-top: 10px;
          margin-right: 0;
          line-height: 1.6;
          color: #777;
        }
      `}</style>
    </div>
  );
};