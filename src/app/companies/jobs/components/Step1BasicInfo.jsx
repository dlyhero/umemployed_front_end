'use client';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export const Step1BasicInfo = ({ form, jobOptions }) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Title</FormLabel>
            <FormControl>
              <Input
                placeholder="e.g., Software Engineer"
                {...field}
                onChange={(e) => {
                  field.onChange(e);
                  form.trigger('title');
                }}
                className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="hire_number"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Number of Hires</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="1"
                placeholder="e.g., 2"
                {...field}
                onChange={(e) => {
                  field.onChange(parseInt(e.target.value, 10) || 1);
                  form.trigger('hire_number');
                }}
                className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="job_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Type</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.trigger('job_type');
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]">
                  <SelectValue placeholder="Select job type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(jobOptions.job_types || {}).map((type) => (
                  <SelectItem key={type} value={type}>
                    {jobOptions.job_types[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="job_location_type"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Job Location Type</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.trigger('job_location_type');
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]">
                  <SelectValue placeholder="Select job location type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(jobOptions.job_location_types || {}).map((type) => (
                  <SelectItem key={type} value={type}>
                    {jobOptions.job_location_types[type]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="location"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Location</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.trigger('location');
              }}
              defaultValue={field.value}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]">
                  <SelectValue placeholder="Select a country" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(jobOptions.locations || []).map((country) => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="salary_range"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Salary Range</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(value);
                form.trigger('salary_range');
              }}
              defaultValue={field.value || 'Not specified'}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]">
                  <SelectValue placeholder="Select a salary range" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(jobOptions.salary_ranges || {}).map((range) => (
                  <SelectItem key={range} value={range}>
                    {jobOptions.salary_ranges[range]}
                  </SelectItem>
                ))}
                <SelectItem value="Not specified">Not specified</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="category"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Category</FormLabel>
            <Select
              onValueChange={(value) => {
                field.onChange(parseInt(value, 10));
                form.trigger('category');
              }}
              defaultValue={field.value?.toString()}
            >
              <FormControl>
                <SelectTrigger className="border-gray-300 focus:border-[#1e90ff] focus:ring-[#1e90ff]">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {(jobOptions.categories || []).map((cat) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};