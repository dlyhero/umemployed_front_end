// /job/components/Step4Skills.jsx
'use client';
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { X } from 'lucide-react';

export const Step4Skills = ({ form }) => {
  const [skillInput, setSkillInput] = useState('');

  const addSkill = (field) => {
    if (skillInput.trim() && !field.value.includes(skillInput.trim())) {
      const newSkills = [...field.value, skillInput.trim()];
      field.onChange(newSkills);
      form.trigger('skills');
      setSkillInput('');
    }
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="skills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills Required</FormLabel>
            <div className="flex gap-2">
              <FormControl>
                <Input
                  placeholder="e.g., JavaScript, Python"
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSkill(field);
                    }
                  }}
                />
              </FormControl>
              <Button
                type="button"
                onClick={() => addSkill(field)}
                className="bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90"
              >
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {field.value.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center gap-1 bg-[#1e90ff]/10 text-[#1e90ff] px-3 py-1 rounded-full text-sm"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => {
                      const newSkills = field.value.filter((_, i) => i !== index);
                      field.onChange(newSkills);
                      form.trigger('skills');
                    }}
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};