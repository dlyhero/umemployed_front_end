// /job/components/Step3Description.jsx
'use client';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';

export const Step3Description = ({ form }) => {
  return (
    <div className="space-y-4">
      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Provide an overview of the job role..."
                className="min-h-[100px]"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger('description'); // Trigger validation on change
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Responsibilities */}
      <FormField
        control={form.control}
        name="responsibilities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Responsibilities</FormLabel>
            <FormControl>
              <Textarea
                placeholder="List the key responsibilities for this role..."
                className="min-h-[100px]"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger('responsibilities'); // Trigger validation on change
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Benefits */}
      <FormField
        control={form.control}
        name="benefits"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Benefits</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the benefits offered (e.g., health insurance, remote work)..."
                className="min-h-[100px]"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger('benefits'); // Trigger validation on change
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};