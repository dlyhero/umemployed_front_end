'use client';

import { Edit, Plus, Trash2, Star, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AddItemModal } from './AddItemModal';
import { useState, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';
import { useSession } from 'next-auth/react';

export const SkillsSection = ({ skills = [], isOwner }) => {
  const { data: session } = useSession();
  const [userSkills, setSkills] = useState(skills);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [newSkill, setNewSkill] = useState(''); // Added missing state
  const [isLoading, setIsLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAll, setShowAll] = useState(false);
  const formRef = useRef(null);

  // Limits and display
  const MAX_SKILLS = 10;
  const initialVisibleCount = 6;
  const visibleSkills = showAll ? userSkills : userSkills.slice(0, initialVisibleCount);

  const canAddMore = () => {
    if (userSkills.length >= MAX_SKILLS) {
      toast.error(`Maximum limit reached`, {
        description: `You can only have up to ${MAX_SKILLS} skills.`,
      });
      return false;
    }
    return true;
  };

  const validateSkill = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = 'Skill name is required';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSkill = async () => {
    if (!validateSkill({ name: newSkill })) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/api/skills`, {
        name: newSkill,
        userId: session?.user?.id,
      }, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      
      setSkills([...userSkills, response.data]);
      setNewSkill('');
      setIsAddOpen(false);
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error('Failed to add skill');
      console.error('Error adding skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditSkill = async (updatedSkill) => {
    if (!validateSkill(updatedSkill)) return;
    
    setIsLoading(true);
    try {
      const response = await axios.put(`${baseUrl}/api/skills/${updatedSkill.id}`, updatedSkill, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      
      setSkills(userSkills.map(skill => 
        skill.id === updatedSkill.id ? response.data : skill
      ));
      setEditingSkill(null);
      toast.success('Skill updated successfully');
    } catch (error) {
      toast.error('Failed to update skill');
      console.error('Error updating skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteSkill = async (skillId) => {
    setIsLoading(true);
    try {
      await axios.delete(`${baseUrl}/api/skills/${skillId}`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      
      setSkills(userSkills.filter(skill => skill.id !== skillId));
      toast.success('Skill deleted successfully');
    } catch (error) {
      toast.error('Failed to delete skill');
      console.error('Error deleting skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Skills</h2>
          <p className="text-sm text-gray-500">
            {userSkills.length}/{MAX_SKILLS} skills
          </p>
        </div>
        
        {isOwner && (
          <Button 
            onClick={() => {
              if (!canAddMore()) return;
              setIsAddOpen(true);
              setEditingSkill(null);
              setValidationErrors({});
            }}
            variant="ghost" 
            size="sm" 
            className="text-brand hover:text-brand"
            disabled={isLoading || userSkills.length >= MAX_SKILLS}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Skill
          </Button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        {visibleSkills.length > 0 ? (
          <>
            {visibleSkills.map((skill) => (
              <div key={skill.id} className="group relative">
                <Badge variant="outline" className="px-3 py-2 rounded-full hover:bg-gray-50">
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
                        onClick={() => {
                          setEditingSkill(skill);
                          setValidationErrors({});
                        }}
                        disabled={isLoading}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-white text-red-500 hover:text-red-600"
                        onClick={() => handleDeleteSkill(skill.id)}
                        disabled={isLoading}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </Badge>
              </div>
            ))}

            {userSkills.length > initialVisibleCount && (
              <div className="w-full flex justify-center pt-4">
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
                      View All ({userSkills.length})
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center w-full py-8">
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
        isLoading={isLoading}
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
            {validationErrors.name && (
              <p className="text-sm text-red-500">{validationErrors.name}</p>
            )}
          </div>
        </div>
      </AddItemModal>

      {/* Edit Skill Modal */}
      {editingSkill && (
        <AddItemModal
          title="Edit Skill"
          open={!!editingSkill}
          onOpenChange={(open) => !open && setEditingSkill(null)}
          onSave={() => handleEditSkill(editingSkill)}
          isLoading={isLoading}
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
              {validationErrors.name && (
                <p className="text-sm text-red-500">{validationErrors.name}</p>
              )}
            </div>
          </div>
        </AddItemModal>
      )}
    </Card>
  );
};