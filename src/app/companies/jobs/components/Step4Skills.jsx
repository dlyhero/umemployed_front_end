'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Step4Skills = ({ form, extracted_skills, isLoadingSkills }) => {
  console.log('Step4Skills - extracted_skills:', extracted_skills, 'isLoadingSkills:', isLoadingSkills);

  return (
    <div className="space-y-4">
      {isLoadingSkills ? (
        <p className="text-sm text-gray-500">Loading skills...</p>
      ) : !extracted_skills || extracted_skills.length === 0 ? (
        <p className="text-sm text-red-500">No skills available to select. Please go back and update the description.</p>
      ) : (
        <>
          {/* Skills Selection */}
          <FormField
            control={form.control}
            name="requirements"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Skills Required (Click to Select)</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {extracted_skills.map((skill) => (
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
                        if (field.value.includes(skill.id)) {
                          // Deselect the skill
                          const newValue = field.value.filter((id) => id !== skill.id);
                          field.onChange(newValue);
                        } else {
                          // Select the skill
                          const newValue = [...field.value, skill.id];
                          field.onChange(newValue);
                        }
                      }}
                    >
                      {skill.name}
                    </Button>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Experience Level Dropdown */}
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-semibold text-gray-700">Experience Level</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
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
        </>
      )}
    </div>
  );
};