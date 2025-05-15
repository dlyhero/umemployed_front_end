'use client';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export const Step1BasicInfo = ({ form, jobOptions }) => {
  return (
    <div className="space-y-6 rounded-lg bg-white p-6 shadow-sm">
      <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
      <div className="grid gap-6 md:grid-cols-2">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Job Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Software Engineer"
                  {...field}
                  onChange={(e) => {
                    field.onChange(e);
                    form.trigger('title');
                  }}
                  className="h-10 rounded-md border-2 border-gray-300 bg-gray-50 px-3 text-gray-900 transition-colors focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/50"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="hire_number"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Number of Hires</FormLabel>
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
                  className="h-10 rounded-md border-2 border-gray-300 bg-gray-50 px-3 text-gray-900 transition-colors focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/50"
                />
              </FormControl>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Job Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger('job_type');
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      'h-10 rounded-md border-2 border-gray-300 bg-gray-50 text-gray-900 transition-colors focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/50',
                      !field.value && 'text-gray-500'
                    )}
                  >
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-64 overflow-y-auto rounded-md border-2 border-gray-200 bg-white shadow-lg">
                  {Object.keys(jobOptions.job_types || {}).map((type) => (
                    <SelectItem key={type} value={type} className="px-3 py-2 hover:bg-gray-100">
                      {jobOptions.job_types[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="job_location_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Job Location Type</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger('job_location_type');
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      'h-10 rounded-md border-2 border-gray-300 bg-gray-50 text-gray-900 transition-colors focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/50',
                      !field.value && 'text-gray-500'
                    )}
                  >
                    <SelectValue placeholder="Select job location type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-64 overflow-y-auto rounded-md border-2 border-gray-200 bg-white shadow-lg">
                  {Object.keys(jobOptions.job_location_types || {}).map((type) => (
                    <SelectItem key={type} value={type} className="px-3 py-2 hover:bg-gray-100">
                      {jobOptions.job_location_types[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Location</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger('location');
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      'h-10 rounded-md border-2 border-gray-300 bg-gray-50 text-gray-900 transition-colors focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/50',
                      !field.value && 'text-gray-500'
                    )}
                  >
                    <SelectValue placeholder="Select a country" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-64 overflow-y-auto rounded-md border-2 border-gray-200 bg-white shadow-lg">
                  {(jobOptions.locations || []).map((country) => (
                    <SelectItem key={country.code} value={country.code} className="px-3 py-2 hover:bg-gray-100">
                      {country.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="salary_range"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Salary Range</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  form.trigger('salary_range');
                }}
                defaultValue={field.value || 'Not specified'}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      'h-10 rounded-md border-2 border-gray-300 bg-gray-50 text-gray-900 transition-colors focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/50',
                      !field.value && 'text-gray-500'
                    )}
                  >
                    <SelectValue placeholder="Select a salary range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-64 overflow-y-auto rounded-md border-2 border-gray-200 bg-white shadow-lg">
                  {Object.keys(jobOptions.salary_ranges || {}).map((range) => (
                    <SelectItem key={range} value={range} className="px-3 py-2 hover:bg-gray-100">
                      {jobOptions.salary_ranges[range]}
                    </SelectItem>
                  ))}
                  <SelectItem value="Not specified" className="px-3 py-2 hover:bg-gray-100">
                    Not specified
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm font-medium text-gray-700">Category</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(parseInt(value, 10));
                  form.trigger('category');
                }}
                defaultValue={field.value?.toString()}
              >
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      'h-10 rounded-md border-2 border-gray-300 bg-gray-50 text-gray-900 transition-colors focus:border-[#1e90ff] focus:ring-2 focus:ring-[#1e90ff]/50',
                      !field.value && 'text-gray-500'
                    )}
                  >
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent className="max-h-64 overflow-y-auto rounded-md border-2 border-gray-200 bg-white shadow-lg">
                  {(jobOptions.categories || []).map((cat) => (
                    <SelectItem key={cat.id} value={cat.id.toString()} className="px-3 py-2 hover:bg-gray-100">
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage className="text-xs text-red-500" />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};