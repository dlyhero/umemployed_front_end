'use client';

import { Edit, Plus, Trash2, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddItemModal } from './AddItemModal';
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { EditModal } from './EditModal';

export const SkillsSection = ({ skills = [], isOwner, onAddSkill, onEditSkill, onDeleteSkill }) => {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState('');

  const handleAddSkill = () => {
    onAddSkill(newSkill);
    setNewSkill('');
    setIsAddOpen(false);
  };

  const handleEditSkill = (updatedSkill) => {
    onEditSkill(editingSkill.id, updatedSkill);
    setEditingSkill(null);
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-900">Skills</h2>
        
        {isOwner && (
          <Button 
            onClick={() => setIsAddOpen(true)}
            variant="ghost" 
            size="sm" 
            className="text-brand hover:text-brand"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {skills.length > 0 ? (
          skills.map((skill) => (
            <div 
              key={skill.id} 
              className="group relative"
            >
              <Badge 
                variant="outline" 
                className="px-3 py-2 rounded-full hover:bg-gray-50"
              >
                <div className="flex items-center gap-1">
                  <span>{skill.name}</span>
                  {skill.endorsements > 0 && (
                    <span className="text-xs text-gray-500">({skill.endorsements})</span>
                  )}
                </div>
                
                {isOwner && (
                  <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-white"
                      onClick={() => setEditingSkill(skill)}
                    >
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-6 w-6 rounded-full bg-white text-red-500 hover:text-red-600"
                      onClick={() => onDeleteSkill(skill.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </Badge>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No skills added</h3>
            <p className="mt-1 text-sm text-gray-500">
              {isOwner ? 'Add your skills to showcase to recruiters.' : 'No skills information available.'}
            </p>
          </div>
        )}
      </div>

      {/* Add Skill Modal */}
      <AddItemModal
        title="Add Skill"
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        onSave={handleAddSkill}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="skill">Skill Name *</Label>
            <Input
              id="skill"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="e.g. React, Project Management"
              required
            />
          </div>
        </div>
      </AddItemModal>

      {/* Edit Skill Modal */}
      {editingSkill && (
        <EditModal
          title="Edit Skill"
          open={!!editingSkill}
          onOpenChange={(open) => !open && setEditingSkill(null)}
          onSave={() => handleEditSkill(editingSkill)}
          defaultValues={editingSkill}
        >
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-skill">Skill Name *</Label>
              <Input
                id="edit-skill"
                value={editingSkill.name}
                onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                required
              />
            </div>
          </div>
        </EditModal>
      )}
    </Card>
  );
};