// /job/components/Step2Requirements.jsx
'use client';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';

export const Step2Requirements = ({ form }) => {
  const jobTypes = ['Full Time', 'Part Time', 'Internship', 'Contract'];
  const experienceLevels = ['No Experience Needed', 'Under 1 Year', '1-3 Years', '3-5 Years', '5-10 Years', '10+ Years'];
  const weeklyRanges = ['Monday to Friday', 'Weekends needed', 'Every weekend', 'Rotating weekend', 'No weekend', 'Weekends only', 'Other', 'None'];
  const shifts = ['Morning shift', 'Day shift', 'Evening shift', 'Night shift', '8 hours shift', '10 hours shift', '12 hours shift', 'Other', 'None'];

  return (
    <div className="space-y-6">
      {/* Job Types */}
      <FormField
        control={form.control}
        name="jobTypes"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Job Types</FormLabel>
            <div className="flex flex-wrap gap-2">
              {jobTypes.map((type) => (
                <Button
                  key={type}
                  type="button"
                  variant={field.value.includes(type) ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value.includes(type)
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value.includes(type)
                      ? field.value.filter((v) => v !== type)
                      : [...field.value, type];
                    field.onChange(newValue);
                    form.trigger('jobTypes');
                  }}
                >
                  {type}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Experience Level */}
      <FormField
        control={form.control}
        name="experienceLevel"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Experience Level</FormLabel>
            <div className="flex flex-wrap gap-2">
              {experienceLevels.map((level) => (
                <Button
                  key={level}
                  type="button"
                  variant={field.value.includes(level) ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value.includes(level)
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value.includes(level)
                      ? field.value.filter((v) => v !== level)
                      : [...field.value, level];
                    field.onChange(newValue);
                    form.trigger('experienceLevel');
                  }}
                >
                  {level}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Weekly Range */}
      <FormField
        control={form.control}
        name="weeklyRange"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Weekly Range</FormLabel>
            <div className="flex flex-wrap gap-2">
              {weeklyRanges.map((range) => (
                <Button
                  key={range}
                  type="button"
                  variant={field.value.includes(range) ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value.includes(range)
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value.includes(range)
                      ? field.value.filter((v) => v !== range)
                      : [...field.value, range];
                    field.onChange(newValue);
                    form.trigger('weeklyRange');
                  }}
                >
                  {range}
                </Button>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Shift */}
      <FormField
        control={form.control}
        name="shift"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm font-semibold text-gray-700">Shift</FormLabel>
            <div className="flex flex-wrap gap-2">
              {shifts.map((shift) => (
                <Button
                  key={shift}
                  type="button"
                  variant={field.value.includes(shift) ? 'default' : 'outline'}
                  className={`rounded-full text-sm ${
                    field.value.includes(shift)
                      ? 'bg-[#1e90ff] text-white hover:bg-[#1e90ff]/90'
                      : 'border-[#1e90ff]/50 text-[#1e90ff] hover:bg-[#1e90ff]/10'
                  }`}
                  onClick={() => {
                    const newValue = field.value.includes(shift)
                      ? field.value.filter((v) => v !== shift)
                      : [...field.value, shift];
                    field.onChange(newValue);
                    form.trigger('shift');
                  }}
                >
                  {shift}
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