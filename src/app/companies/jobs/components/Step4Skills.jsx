'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { X } from 'lucide-react';

export const Step4Skills = ({ form, extracted_skills }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="requirements"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Skills Required</FormLabel>
            <div className="flex flex-wrap gap-2">
              {(extracted_skills || []).map((skill) => (
                <Button
                  key={skill.id}
                  type="button"
                  variant={field.value.includes(skill.id) ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value.includes(skill.id)
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value.includes(skill.id)
                      ? field.value.filter((id) => id !== skill.id)
                      : [...field.value, skill.id];
                    field.onChange(newValue);
                    form.trigger('requirements');
                  }}
                >
                  {skill.name}
                </Button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {field.value.map((skillId, index) => {
                const skill = (extracted_skills || []).find((s) => s.id === skillId);
                return (
                  <div
                    key={index}
                    className="flex items-center gap-1 bg-[#1e90ff]/10 text-[#1e90ff] px-3 py-1 rounded-full text-sm"
                  >
                    {skill ? skill.name : `Skill ${skillId}`}
                    <button
                      type="button"
                      onClick={() => {
                        const newRequirements = field.value.filter((_, i) => i !== index);
                        field.onChange(newRequirements);
                        form.trigger('requirements');
                      }}
                    >
                      <X size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="level"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Experience Level</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.trigger('level');
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]">
                  <SelectValue placeholder="Select an experience level" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="Beginner">Beginner</SelectItem>
                <SelectItem value="Mid">Mid</SelectItem>
                <SelectItem value="Senior">Senior</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};