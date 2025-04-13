'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export const Step2Requirements = ({ form, jobOptions }) => {
  return (
    <div className="space-y-6">
      <FormField
        control={form.control}
        name="job_type" // Renamed from job_types
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Job Types</FormLabel>
            <div className="flex flex-wrap gap-2">
              {Object.keys(jobOptions.job_types || {}).map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={field.value === type ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value === type
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value === type ? '' : type; // Toggle: select or deselect
                    field.onChange(newValue);
                    form.trigger('job_type');
                  }}
                >
                  {jobOptions.job_types[type]}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="experience_levels"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Experience Levels</FormLabel>
            <div className="flex flex-wrap gap-2">
              {Object.keys(jobOptions.experience_levels || {}).map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={field.value === level ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value === level
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value === level ? '' : level;
                    field.onChange(newValue);
                    form.trigger('experience_levels');
                  }}
                >
                  {jobOptions.experience_levels[level]}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="weekly_ranges"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Weekly Ranges</FormLabel>
            <div className="flex flex-wrap gap-2">
              {Object.keys(jobOptions.weekly_ranges || {}).map((range) => (
                <Button
                  key={range}
                  type="button"
                  variant={field.value === range ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value === range
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value === range ? '' : range;
                    field.onChange(newValue);
                    form.trigger('weekly_ranges');
                  }}
                >
                  {jobOptions.weekly_ranges[range]}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="shifts"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Shifts</FormLabel>
            <div className="flex flex-wrap gap-2">
              {Object.keys(jobOptions.shifts || {}).map((shift) => (
                <Button
                  key={shift}
                  type="button"
                  variant={field.value === shift ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value === shift
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value === shift ? '' : shift;
                    field.onChange(newValue);
                    form.trigger('shifts');
                  }}
                >
                  {jobOptions.shifts[shift]}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};