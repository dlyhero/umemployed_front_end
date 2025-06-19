'use client';

import { Languages, Edit, Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddItemModal } from './AddItemModal';
import { useState, useRef } from 'react';
import { div } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';
import { useSession } from 'next-auth/react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const LanguagesSection = ({ languages = [], isOwner }) => {
  const { data: session } = useSession();
  const [userLanguages, setLanguages] = useState(languages);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAll, setShowAll] = useState(false);
  const formRef = useRef(null);

  const MAX_LANGUAGES = 5;
  const initialVisibleCount = 3;
  const visibleLanguages = showAll ? userLanguages : userLanguages.slice(0, initialVisibleCount);

  const proficiencyLevels = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'native', label: 'Native' },
  ];

  const canAddMore = () => {
    if (userLanguages.length >= MAX_LANGUAGES) {
      toast.error('Maximum limit reached', {
        description: `You can only have up to ${MAX_LANGUAGES} languages.`,
      });
      return false;
    }
    return true;
  };

  const validateLanguage = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = 'Language name is required';
    if (!data.proficiency) errors.proficiency = 'Proficiency level is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddLanguage = async (newLanguage) => {
    if (!validateLanguage(newLanguage)) return;
    if (!canAddMore()) return;

    try {
      setIsLoading(true);
      toast.loading('Adding language...');

      const { data } = await axios.post(`${baseUrl}/resume/languages/`, newLanguage, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setLanguages([...userLanguages, data]);
      setIsAddOpen(false);
      setValidationErrors({});
      toast.success('Language added successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add language');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleEdit = (language) => {
    setEditingLanguage(language);
    setIsAddOpen(true);
  };

  const handleSave = async (updatedLanguage) => {
    if (!validateLanguage(updatedLanguage)) return;

    try {
      setIsLoading(true);
      toast.loading('Saving changes...');

      const { data } = await axios.put(`${baseUrl}/resume/languages/${updatedLanguage.id}/`, updatedLanguage, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setLanguages(userLanguages.map((lang) => (lang.id === updatedLanguage.id ? data : lang)));
      setEditingLanguage(null);
      setIsAddOpen(false);
      setValidationErrors({});
      toast.success('Language updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update language');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleDeleteLanguage = async (id) => {
    try {
      setIsLoading(true);
      toast.loading('Deleting...');

      await axios.delete(`${baseUrl}/resume/languages/${id}/`, {
        headers: {
          Authorization: `Bearer ${session?.accessToken}`,
        },
      });

      setLanguages(userLanguages.filter((lang) => lang.id !== id));
      toast.success('Language deleted');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete language');
    } finally {
      setIsLoading(false);
      toast.dismiss();
    }
  };

  const handleModalClose = () => {
    setIsAddOpen(false);
    setEditingLanguage(null);
    setValidationErrors({});
  };

  return (
    <div className="p-6 border-b">
      <div className="flex justify-between items-center mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Languages className="text-gray-700 h-5 w-5" />
            <h2 className="text-xl font-bold text-gray-900">Languages</h2>
          </div>
          <p className="text-sm text-gray-500 ml-7">
            {userLanguages.length}/{MAX_LANGUAGES} languages
          </p>
        </div>

        {isOwner && (
          <Button
            onClick={() => {
              if (!canAddMore()) return;
              setIsAddOpen(true);
              setEditingLanguage(null);
              setValidationErrors({});
            }}
            variant="ghost"
            size="sm"
            className="text-brand hover:text-brand border border-brand py-6 rounded-full"
            disabled={isLoading || userLanguages.length >= MAX_LANGUAGES}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Language
          </Button>
        )}
      </div>

      <div className="space-y-4">
        {visibleLanguages.length > 0 ? (
          <>
            {visibleLanguages.map((lang) => (
              <div key={lang.id} className="group relative pb-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{lang.name}</h3>
                    <p className="text-gray-500 text-sm capitalize">
                      {lang.proficiency?.toLowerCase()}
                    </p>
                  </div>

                  {isOwner && (
                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-brand hover:text-brand"
                        onClick={() => handleEdit(lang)}
                        disabled={isLoading}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteLanguage(lang.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {userLanguages.length > initialVisibleCount && (
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
                      View All ({userLanguages.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8">
            <h3 className="mt-2 text-sm font-medium text-gray-900">No languages added</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isOwner ? 'Add languages you speak to showcase to recruiters.' : 'No languages information available.'}
            </p>
          </div>
        )}
      </div>

      <AddItemModal
        title={editingLanguage ? 'Edit Language' : 'Add Language'}
        open={isAddOpen}
        onOpenChange={handleModalClose}
        onSave={editingLanguage ? handleSave : handleAddLanguage}
        isLoading={isLoading}
      >
        <div className="space-y-4">
          <div>
            <Label>Language</Label>
            <Input
              placeholder="e.g., French"
              value={editingLanguage?.name || ''}
              onChange={(e) => setEditingLanguage({
                ...editingLanguage,
                name: e.target.value
              })}
            />
            {validationErrors.name && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
            )}
          </div>

          <div>
            <Label>Proficiency</Label>
            <Select
              value={editingLanguage?.proficiency || ''}
              onValueChange={(value) => setEditingLanguage({
                ...editingLanguage,
                proficiency: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select proficiency" />
              </SelectTrigger>
              <SelectContent>
                {proficiencyLevels.map((level) => (
                  <SelectItem key={level.value} value={level.value}>
                    {level.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.proficiency && (
              <p className="text-red-500 text-xs mt-1">{validationErrors.proficiency}</p>
            )}
          </div>
        </div>
      </AddItemModal>
    </div>
  );
};