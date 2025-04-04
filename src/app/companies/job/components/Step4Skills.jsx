// /job/components/Step4Skills.jsx
import { useState } from "react";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Step4Skills = ({ form }) => {
  const [requiredSkill, setRequiredSkill] = useState("");
  const [preferredSkill, setPreferredSkill] = useState("");

  const handleAddRequiredSkill = () => {
    if (requiredSkill.trim()) {
      const currentSkills = form.getValues("skills.requiredSkills") || [];
      form.setValue("skills.requiredSkills", [...currentSkills, requiredSkill.trim()]);
      setRequiredSkill("");
    }
  };

  const handleAddPreferredSkill = () => {
    if (preferredSkill.trim()) {
      const currentSkills = form.getValues("skills.preferredSkills") || [];
      form.setValue("skills.preferredSkills", [...currentSkills, preferredSkill.trim()]);
      setPreferredSkill("");
    }
  };

  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow">
      <FormField
        control={form.control}
        name="skills.requiredSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Required Skills</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={requiredSkill}
                    onChange={(e) => setRequiredSkill(e.target.value)}
                    placeholder="Add a required skill"
                  />
                  <Button type="button" onClick={handleAddRequiredSkill}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-brand text-white px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="skills.preferredSkills"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Preferred Skills (Optional)</FormLabel>
            <FormControl>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={preferredSkill}
                    onChange={(e) => setPreferredSkill(e.target.value)}
                    placeholder="Add a preferred skill"
                  />
                  <Button type="button" onClick={handleAddPreferredSkill}>
                    Add
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {field.value?.map((skill, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-800 px-2 py-1 rounded"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};