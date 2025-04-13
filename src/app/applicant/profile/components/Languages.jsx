'use client';

import { Languages, Edit, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddItemModal } from './AddItemModal';
import { EditModal } from './EditModal';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export const LanguagesSection = ({ languages = [], isOwner, onAddLanguage, onEditLanguage, onDeleteLanguage }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingLanguage, setEditingLanguage] = useState(null);
  const [newLanguage, setNewLanguage] = useState({
    name: '',
    proficiency: 'fluent'
  });

  const proficiencyLevels = [
    { value: 'basic', label: 'Basic' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'fluent', label: 'Fluent' },
    { value: 'native', label: 'Native' }
  ];

  const handleAddLanguage = () => {
    onAddLanguage(newLanguage);
    setNewLanguage({ name: '', proficiency: 'fluent' });
    setIsAddOpen(false);
  };

  const handleEditLanguage = (updatedLanguage) => {
    onEditLanguage(editingLanguage.id, updatedLanguage);
    setEditingLanguage(null);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Languages className="text-gray-700 h-5 w-5" />
          <h2 className="text-xl font-bold text-gray-900">Languages</h2>
        </div>
        
        {isOwner && (
          <Button 
            onClick={() => setIsAddOpen(true)}
            variant="ghost" 
            size="sm" 
            className="text-brand hover:text-brand"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Language
          </Button>
        )}
      </div>
      
      <div className="space-y-4">
        {languages.length > 0 ? (
          languages.map((lang) => (
            <div key={lang.id} className="group relative">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium text-gray-900">{lang.name}</h3>
                  <p className="text-gray-500 text-sm capitalize">
                    {lang.proficiency.toLowerCase()}
                  </p>
                </div>
                
                {isOwner && (
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-brand hover:text-brand"
                      onClick={() => setEditingLanguage(lang)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-600"
                      onClick={() => onDeleteLanguage(lang.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Languages className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No languages added</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isOwner ? 'Add languages you speak to showcase to recruiters.' : 'No languages information available.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Language Modal */}
      <AddItemModal
        title="Add Language"
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddLanguage}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="language">Language *</Label>
            <Input
              id="language"
              value={newLanguage.name}
              onChange={(e) => setNewLanguage({...newLanguage, name: e.target.value})}
              placeholder="e.g. Spanish, French"
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Proficiency *</Label>
            <Select
              value={newLanguage.proficiency}
              onValueChange={(value) => setNewLanguage({...newLanguage, proficiency: value})}
            >
              <SelectTrigger className="w-full">
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
          </div>
        </div>
      </AddItemModal>

      {/* Edit Language Modal */}
      {editingLanguage && (
        <EditModal
          title="Edit Language"
          open={!!editingLanguage}
          onOpenChange={(open) => !open && setEditingLanguage(null)}
          onSave={() => handleEditLanguage(editingLanguage)}
          defaultValues={editingLanguage}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-language">Language *</Label>
              <Input
                id="edit-language"
                value={editingLanguage.name}
                onChange={(e) => setEditingLanguage({...editingLanguage, name: e.target.value})}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Proficiency *</Label>
              <Select
                value={editingLanguage.proficiency}
                onValueChange={(value) => setEditingLanguage({...editingLanguage, proficiency: value})}
              >
                <SelectTrigger className="w-full">
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
            </div>
          </div>
        </EditModal>
      )}
    </Card>
  );
};