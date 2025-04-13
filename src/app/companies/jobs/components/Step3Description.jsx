'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';

export const Step3Description = ({ form }) => {
  return (
    <div className="space-y-4">
      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Description</FormLabel>
            <FormControl>
              <Textarea
                placeholder="Describe the job in detail..."
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger('description');
                }}
                rows={6}
                className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]"
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
                placeholder="List key responsibilities..."
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger('responsibilities');
                }}
                rows={6}
                className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]"
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
                placeholder="Describe benefits offered..."
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger('benefits');
                }}
                rows={6}
                className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};