'use client';

import { Edit, Plus, Trash2, Star, ChevronDown, ChevronUp, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import axios from 'axios';
import baseUrl from '@/src/app/api/baseUrl';
import { useSession } from 'next-auth/react';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useState, useEffect, useCallback, useRef } from 'react';

export const SkillsSection = ({ skills = [], isOwner }) => {
  const { data: session } = useSession();
  const [userSkills, setSkills] = useState(skills);
  const [availableSkills, setAvailableSkills] = useState([]);
  const [editingSkill, setEditingSkill] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [openSearch, setOpenSearch] = useState(false);
  const searchTimeoutRef = useRef(null);

  const MAX_SKILLS = 20;
  const initialVisibleCount = 6;
  const visibleSkills = showAll ? userSkills : userSkills.slice(0, initialVisibleCount);
  const DEFAULT_CATEGORY_ID = 1;

  // Fetch user skills on mount and when session changes
  const fetchUserSkills = async () => {
    try {
      setIsFetching(true);
      const response = await axios.get(`${baseUrl}/resume/skills/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` }
      });
      setSkills(response.data);
    } catch (error) {
      console.error('Error fetching user skills:', error);
    } finally {
      setIsFetching(false);
    }
  }
  // Fetch available skills with debounce
  const fetchAvailableSkills = useCallback(async (query = '') => {
    try {
      const response = await axios.get(`${baseUrl}/resume/skills-list/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
        params: { search: query }
      });
      setAvailableSkills(response.data);
    } catch (error) {
      console.error('Error fetching available skills:', error);
    }
  }, [session?.accessToken]);

  useEffect(() => {
    if (isOwner) {
      fetchUserSkills();
      // Preload available skills when component mounts
      fetchAvailableSkills();
    }
  }, [isOwner, fetchUserSkills, fetchAvailableSkills]);

  useEffect(() => {
    if (openSearch) {
      // Clear previous timeout
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
      
      // Set new timeout for debouncing
      searchTimeoutRef.current = setTimeout(() => {
        fetchAvailableSkills(searchQuery);
      }, 200);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery, openSearch, fetchAvailableSkills]);

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
    if (data.name?.length > 100) errors.name = 'Skill name must be less than 100 characters';
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddSkill = async (skillName) => {
    if (!validateSkill({ name: skillName })) return;
    
    setIsLoading(true);
    try {
      const response = await axios.post(`${baseUrl}/resume/skills/`, {
        name: skillName.trim(),
        is_extracted: false,
        user: session?.user?.id,
        categories: [DEFAULT_CATEGORY_ID]
      }, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      
      setSkills(prev => [...prev, response.data]);
      setSearchQuery('');
      setOpenSearch(false);
      toast.success('Skill added successfully');
    } catch (error) {
      toast.error('Failed to add skill');
      console.error('Error adding skill:', error.response?.data || error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // ... (keep handleEditSkill and handleDeleteSkill the same as before)

  const handleEditSkill = async (updatedSkill) => {
    if (!validateSkill(updatedSkill)) return;
    
    setIsLoading(true);
    try {
      const response = await axios.patch(`${baseUrl}/resume/skills/${updatedSkill.id}/`, {
        name: updatedSkill.name,
        categories: updatedSkill.categories?.length ? updatedSkill.categories : [DEFAULT_CATEGORY_ID]
      }, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      
      setSkills(prev => prev.map(skill => 
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
      await axios.delete(`${baseUrl}/resume/skills/${skillId}/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      
      setSkills(prev => prev.filter(skill => skill.id !== skillId));
      toast.success('Skill deleted successfully');
    } catch (error) {
      toast.error('Failed to delete skill');
      console.error('Error deleting skill:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSkills = availableSkills
    .filter(skill => 
      skill.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !userSkills.some(userSkill => userSkill.name.toLowerCase() === skill.name.toLowerCase())
    )
    .slice(0, 5); // Limit to 5 suggestions

  return (
    <Card className="p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Skills</h2>
          <p className="text-sm text-gray-500">
            {userSkills.length}/{MAX_SKILLS} skills
          </p>
        </div>
        
        {isOwner && (
          <Popover open={openSearch} onOpenChange={(open) => {
            setOpenSearch(open);
            if (!open) setSearchQuery('');
          }}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                disabled={isLoading || userSkills.length >= MAX_SKILLS}
                onClick={() => canAddMore() && setOpenSearch(true)}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Skill
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[320px] p-0" align="end" sideOffset={8}>
              <Command shouldFilter={false}>
                <CommandInput
                  placeholder="Search skills..."
                  value={searchQuery}
                  onValueChange={(value) => {
                    setSearchQuery(value);
                  }}
                />
                <CommandList>
                  {searchQuery && (
                    <CommandItem 
                      onSelect={() => handleAddSkill(searchQuery)}
                      className="cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
                    >
                      <Plus className="mr-2 h-4 w-4 text-blue-500" />
                      <span className="font-medium">Add "{searchQuery}"</span>
                    </CommandItem>
                  )}
                  <CommandEmpty className="py-3 text-center text-sm text-gray-500">
                    {searchQuery ? 'No matching skills found' : 'Start typing to search'}
                  </CommandEmpty>
                  {filteredSkills.length > 0 && (
                    <CommandGroup heading="Suggested Skills">
                      {filteredSkills.map((skill) => (
                        <CommandItem
                          key={skill.id}
                          value={skill.name}
                          onSelect={() => {
                            handleAddSkill(skill.name);
                            setSearchQuery('');
                          }}
                          className="cursor-pointer hover:bg-gray-50 aria-selected:bg-gray-50"
                        >
                          <Search className="mr-2 h-4 w-4 text-gray-400" />
                          {skill.name}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  )}
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
        )}
      </div>
      
      {/* ... (rest of the component remains the same) ... */}

      <div className="flex flex-wrap gap-2">
        {visibleSkills.length > 0 ? (
          <>
            {visibleSkills.map((skill) => (
              <div key={skill.id} className="group relative">
                <Badge variant="outline" className="px-3 py-1.5 rounded-full hover:bg-gray-50 border-gray-200">
                  <div className="flex items-center gap-1">
                    <span className="text-sm">{skill.name}</span>
                    {skill.endorsements > 0 && (
                      <span className="text-xs text-gray-500">({skill.endorsements})</span>
                    )}
                  </div>
                  
                  {isOwner && (
                    <div className="absolute -right-2 -top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6 rounded-full bg-white hover:bg-gray-100"
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
                        className="h-6 w-6 rounded-full bg-white text-red-500 hover:bg-red-50"
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
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
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

      {/* Edit Skill Modal */}
      {editingSkill && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Skill</h3>
              <button 
                onClick={() => setEditingSkill(null)}
                className="rounded-full p-1 hover:bg-gray-100"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-skill">Skill Name *</Label>
                <Input
                  id="edit-skill"
                  value={editingSkill.name}
                  onChange={(e) => setEditingSkill({...editingSkill, name: e.target.value})}
                  maxLength={100}
                  required
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setEditingSkill(null)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                onClick={() => handleEditSkill(editingSkill)}
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? 'Saving...' : 'Save'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};