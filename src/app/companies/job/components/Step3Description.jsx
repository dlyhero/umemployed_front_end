// /job/components/Step3Description.jsx
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

export const Step3Description = ({ form }) => {
  return (
    <div className="space-y-4 bg-white p-6 rounded-lg shadow">
      <FormField
        control={form.control}
        name="description.jobDescription"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the job role and requirements..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="description.responsibilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Key Responsibilities</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List key responsibilities..."
                className="min-h-[150px]"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};